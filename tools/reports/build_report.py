# -*- coding: utf-8 -*-
"""
Генератор PDF-отчётов о работе над сайтом «Технопарк 1219».

Запуск:
    python tools/reports/build_report.py tools/reports/periods/2026-07.json

Все тексты и состав периода задаются в JSON-конфиге, метрики считаются
автоматически из src/data/residentPortalContentData.ts. Правила — в README.md.
"""
import json
import os
import re
import subprocess
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Frame, NextPageTemplate, PageBreak,
                                PageTemplate, Paragraph, Spacer, Table, TableStyle)

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DATA_REL = 'src/data/residentPortalContentData.ts'

# ---- палитра сайта (src/index.css) ----
PRIMARY  = colors.HexColor('#1F2933')
ACCENT   = colors.HexColor('#2F6FED')
STEEL    = colors.HexColor('#6B7C8F')
BG_LIGHT = colors.HexColor('#F5F7F9')
BG_SOFT  = colors.HexColor('#E6EEF8')
BORDER   = colors.HexColor('#D9E1E8')
SUBTITLE = colors.HexColor('#AFC4DE')

FONT_DIR = os.environ.get('WINDIR', 'C:/Windows') + '/Fonts/'
pdfmetrics.registerFont(TTFont('Ar', FONT_DIR + 'arial.ttf'))
pdfmetrics.registerFont(TTFont('ArB', FONT_DIR + 'arialbd.ttf'))
pdfmetrics.registerFont(TTFont('ArI', FONT_DIR + 'ariali.ttf'))
pdfmetrics.registerFontFamily('Ar', normal='Ar', bold='ArB', italic='ArI')

PW, PH = A4
ML = MR = 18 * mm
CW = PW - ML - MR


# ---------------------------------------------------------------- источник данных
def load_source(spec):
    """spec: 'working' — рабочая копия, 'git:<ревизия>' — состояние на конец периода."""
    if spec == 'working':
        with open(os.path.join(ROOT, DATA_REL), encoding='utf-8') as f:
            return f.read()
    if spec.startswith('git:'):
        rev = spec[4:]
        out = subprocess.run(['git', 'show', '%s:%s' % (rev, DATA_REL)],
                             cwd=ROOT, capture_output=True)
        if out.returncode != 0:
            sys.exit('git show %s:%s -> %s' % (rev, DATA_REL, out.stderr.decode('utf-8', 'replace')))
        return out.stdout.decode('utf-8')
    sys.exit('Неизвестный source: %s (ожидается "working" или "git:<ревизия>")' % spec)


def quotes(s):
    """Прямые кавычки -> «ёлочки». Косметика отчёта, данные проекта не меняются."""
    out, open_q = [], True
    for ch in s:
        if ch == '"':
            out.append('«' if open_q else '»')
            open_q = not open_q
        else:
            out.append(ch)
    return ''.join(out)


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def nbsp_num(n):
    return '{:,}'.format(n).replace(',', ' ')


class Corpus:
    def __init__(self, src):
        self.src = src
        self.titles = {}
        for m in re.finditer(r"id: '([^']+)',\s*\n\s*title: '((?:[^'\\]|\\.)*)'", src):
            self.titles.setdefault(m.group(1), m.group(2))

    def article(self, aid):
        i = self.src.find("id: '%s'," % aid)
        if i < 0:
            sys.exit('Статья %s не найдена в источнике данных' % aid)
        j = self.src.find("id: '", i + 10)
        b = self.src[i: j if j != -1 else len(self.src)]
        rel_raw = re.search(r"relatedItemIds: \[(.*?)\]", b, re.S).group(1)
        rel_ids = [x.strip().strip("'") for x in rel_raw.split(',') if x.strip()]
        texts = re.findall(r"type: 'text', text: '((?:[^'\\]|\\.)*)'", b)
        img = re.search(r"\n\s+image: '([^']*)'", b)
        return dict(
            id=aid,
            title=quotes(re.search(r"title: '((?:[^'\\]|\\.)*)'", b).group(1)),
            excerpt=quotes(re.search(r"excerpt: '((?:[^'\\]|\\.)*)'", b).group(1)),
            read=re.search(r"readTime: '([^']+)'", b).group(1),
            words=sum(len(t.split()) for t in texts),
            chars=sum(len(t) for t in texts),
            image=img.group(1) if img else '',
            rel=[self.titles.get(r, r) for r in rel_ids],
        )


# ---------------------------------------------------------------- стили
def st(name, **kw):
    base = dict(fontName='Ar', fontSize=9.5, leading=14, textColor=PRIMARY)
    base.update(kw)
    return ParagraphStyle(name, **base)


H1     = st('H1', fontName='ArB', fontSize=17, leading=22, spaceAfter=3)
BODY   = st('Body', alignment=TA_JUSTIFY, spaceAfter=6)
LEAD   = st('Lead', fontSize=10.5, leading=16, alignment=TA_JUSTIFY, spaceAfter=5)
CELL   = st('Cell', fontSize=9, leading=13)
CELLB  = st('CellB', fontName='ArB', fontSize=9.5, leading=13)
CELLC  = st('CellC', fontSize=9.5, leading=13, alignment=TA_CENTER)
CELLCB = st('CellCB', fontName='ArB', fontSize=9.5, leading=13, alignment=TA_CENTER)
TH     = st('TH', fontName='ArB', fontSize=8.5, leading=11, textColor=colors.white)
THC    = st('THC', fontName='ArB', fontSize=8.5, leading=11, textColor=colors.white, alignment=TA_CENTER)
SMALL  = st('Small', fontSize=8.5, leading=12, textColor=STEEL)
GROUP  = st('Group', fontName='ArB', fontSize=10.5, leading=14)
NUM    = st('Num', fontName='ArB', fontSize=19, leading=22, textColor=ACCENT, alignment=TA_CENTER)
NUMLBL = st('NumLbl', fontSize=7.8, leading=10.5, textColor=STEEL, alignment=TA_CENTER)


# ---------------------------------------------------------------- блоки
def numbered_block(items):
    """Нумерованный список «заголовок + текст» (методика, прочие работы)."""
    rw = [[Paragraph(str(i), CELLCB), Paragraph('<b>%s</b><br/>%s' % (h, txt), CELL)]
          for i, (h, txt) in enumerate(items, 1)]
    t = Table(rw, colWidths=[10 * mm, CW - 10 * mm])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEBELOW', (0, 0), (-1, -2), 0.5, BORDER),
        ('TEXTCOLOR', (0, 0), (0, -1), ACCENT),
        ('TOPPADDING', (0, 0), (-1, -1), 7), ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (0, -1), 0),
    ]))
    return t


def build(cfg, corpus):
    period_short = cfg['period_short']
    out_path = cfg['output'] if os.path.isabs(cfg['output']) \
        else os.path.normpath(os.path.join(os.path.dirname(cfg['__path__']), cfg['output']))
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    groups = []
    for d in cfg['directions']:
        groups.append((d['name'], d.get('before'), [corpus.article(a) for a in d['articles']]))
    arts = [a for _, _, items in groups for a in items]
    n_art = len(arts)
    words = sum(a['words'] for a in arts)
    chars = sum(a['chars'] for a in arts)
    links = sum(len(a['rel']) for a in arts)
    images = len({a['image'] for a in arts if a['image']})

    def page_footer(canv, first):
        canv.setStrokeColor(BORDER)
        canv.setLineWidth(0.5)
        canv.line(ML, 14 * mm, PW - MR, 14 * mm)
        canv.setFont('Ar', 8)
        canv.setFillColor(STEEL)
        if first:
            canv.drawString(ML, 10 * mm, 'Дата составления: ' + cfg['compiled'])
        canv.drawRightString(PW - MR, 10 * mm, str(canv.getPageNumber()))

    def first_page(canv, doc):
        canv.saveState()
        canv.setFillColor(PRIMARY)
        canv.rect(0, PH - 62 * mm, PW, 62 * mm, stroke=0, fill=1)
        canv.setFillColor(ACCENT)
        canv.rect(0, PH - 62 * mm, PW, 3, stroke=0, fill=1)
        canv.setFillColor(colors.white)
        canv.setFont('ArB', 25)
        canv.drawString(ML, PH - 33 * mm, cfg.get('title', 'Отчёт о работе над сайтом'))
        canv.setFont('Ar', 13)
        canv.setFillColor(SUBTITLE)
        canv.drawString(ML, PH - 43 * mm, cfg.get('subtitle', 'Промышленный технопарк «1219», г. Троицк'))
        canv.setFont('ArB', 13)
        canv.setFillColor(colors.white)
        canv.drawString(ML, PH - 53 * mm, 'Отчётный период: ' + cfg['period_label'])
        page_footer(canv, True)
        canv.restoreState()

    def later_pages(canv, doc):
        canv.saveState()
        canv.setFont('Ar', 8)
        canv.setFillColor(STEEL)
        canv.drawString(ML, PH - 12 * mm, 'Технопарк 1219 — отчёт о работе над сайтом, ' + period_short)
        canv.setStrokeColor(BORDER)
        canv.setLineWidth(0.5)
        canv.line(ML, PH - 14 * mm, PW - MR, PH - 14 * mm)
        page_footer(canv, False)
        canv.restoreState()

    doc = BaseDocTemplate(out_path, pagesize=A4, leftMargin=ML, rightMargin=MR,
                          topMargin=20 * mm, bottomMargin=20 * mm,
                          title='%s — Технопарк 1219, %s' % (cfg.get('title', 'Отчёт о работе над сайтом'), period_short),
                          author='Технопарк 1219')
    doc.addPageTemplates([
        PageTemplate(id='First', frames=[Frame(ML, 20 * mm, CW, PH - 88 * mm, id='f1')], onPage=first_page),
        PageTemplate(id='Rest', frames=[Frame(ML, 20 * mm, CW, PH - 42 * mm, id='f2')], onPage=later_pages),
    ])

    S = [NextPageTemplate('Rest')]

    # 1. Итоги периода
    S.append(Paragraph('Итоги периода', H1))
    S.append(Spacer(1, 6))
    S.append(Paragraph(cfg['intro'].format(n=n_art), LEAD))
    S.append(Spacer(1, 4))

    cards = [
        [Paragraph(str(n_art), NUM), Paragraph(str(len(groups)), NUM), Paragraph(str(images), NUM),
         Paragraph(nbsp_num(words), NUM), Paragraph(str(links), NUM)],
        [Paragraph('новых статей', NUMLBL), Paragraph('направлений<br/>охвачено', NUMLBL),
         Paragraph('иллюстраций<br/>подготовлено', NUMLBL), Paragraph('слов<br/>авторского текста', NUMLBL),
         Paragraph('связей с товарами<br/>и услугами', NUMLBL)],
    ]
    t = Table(cards, colWidths=[CW / 5.0] * 5, rowHeights=[13 * mm, 9 * mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, 0), 'BOTTOM'), ('VALIGN', (0, 1), (-1, 1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, 0), 6), ('BOTTOMPADDING', (0, 1), (-1, 1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 3), ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ]))
    S.append(t)
    S.append(Spacer(1, 7))
    S.append(Paragraph(cfg['summary_note'].format(
        avg=round(words / n_art),
        chars=('%.1f' % (chars / 1000.0)).replace('.', ','),
        n=n_art), BODY))

    # 2. Динамика базы знаний
    if all(g[1] for g in groups):
        S.append(Spacer(1, 5))
        S.append(Paragraph('Динамика базы знаний', H1))
        S.append(Spacer(1, 4))
        S.append(Paragraph(cfg['dynamics_note'], BODY))
        S.append(Spacer(1, 1))
        rows = [[Paragraph('Направление', TH), Paragraph('Было', THC),
                 Paragraph('Добавлено', THC), Paragraph('Стало', THC), Paragraph('Прирост', THC)]]
        tb = ta = 0
        for name, before, items in groups:
            tb += before
            ta += len(items)
            rows.append([Paragraph(name, CELL), Paragraph(str(before), CELLC),
                         Paragraph('+%d' % len(items), CELLC),
                         Paragraph(str(before + len(items)), CELLCB),
                         Paragraph('+%d%%' % round(len(items) / before * 100), CELLC)])
        rows.append([Paragraph('Итого по активным направлениям', CELLB), Paragraph(str(tb), CELLCB),
                     Paragraph('+%d' % ta, CELLCB), Paragraph(str(tb + ta), CELLCB),
                     Paragraph('+%d%%' % round(ta / tb * 100), CELLCB)])
        t = Table(rows, colWidths=[CW - 4 * 22 * mm] + [22 * mm] * 4, repeatRows=1)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
            ('BACKGROUND', (0, -1), (-1, -1), BG_SOFT),
            ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.white, BG_LIGHT]),
            ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 3.2), ('BOTTOMPADDING', (0, 0), (-1, -1), 3.2),
            ('LEFTPADDING', (0, 0), (-1, -1), 6), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        S.append(t)
        if cfg.get('hidden_note'):
            S.append(Spacer(1, 5))
            S.append(Paragraph(cfg['hidden_note'], SMALL))

    # 3. Прочие работы (необязательный раздел)
    if cfg.get('other_works'):
        S.append(PageBreak())
        S.append(Paragraph('Прочие работы за период', H1))
        S.append(Spacer(1, 5))
        S.append(numbered_block(cfg['other_works']))
        S.append(Spacer(1, 10))
        S.append(Paragraph('Как устроены статьи', H1))
    else:
        S.append(PageBreak())
        S.append(Paragraph('Как устроены статьи', H1))

    # 4. Методика
    S.append(Spacer(1, 5))
    S.append(Paragraph(cfg['method_intro'], BODY))
    S.append(numbered_block([(h, txt.format(links=links, n=n_art)) for h, txt in cfg['principles']]))

    # 5. Перечень статей
    S.append(PageBreak())
    S.append(Paragraph('Перечень опубликованных статей', H1))
    S.append(Spacer(1, 4))
    S.append(Paragraph(
        'Полный список материалов, подготовленных за отчётный период, с указанием связанных позиций '
        'каталога и ориентировочного времени чтения.', BODY))
    S.append(Spacer(1, 4))

    rows = [[Paragraph('№', THC), Paragraph('Статья', TH),
             Paragraph('Связана с товарами и услугами', TH), Paragraph('Чтение', THC)]]
    style = [
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('VALIGN', (0, 0), (-1, 0), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6), ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 5), ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]
    n = 0
    for name, _, items in groups:
        r = len(rows)
        rows.append([Paragraph(name, GROUP), '', '', ''])
        style += [('SPAN', (0, r), (-1, r)), ('BACKGROUND', (0, r), (-1, r), BG_SOFT),
                  ('TOPPADDING', (0, r), (-1, r), 7), ('BOTTOMPADDING', (0, r), (-1, r), 7)]
        for k, a in enumerate(items):
            n += 1
            rows.append([
                Paragraph(str(n), CELLC),
                Paragraph('<b>%s</b><br/><font color="#6B7C8F">%s</font>'
                          % (esc(a['title']), esc(a['excerpt'])), CELL),
                Paragraph('<br/>'.join('• ' + esc(x) for x in a['rel']), SMALL),
                Paragraph(a['read'].replace(' мин', ' мин.'), CELLC),
            ])
            if k % 2 == 1:
                style.append(('BACKGROUND', (0, len(rows) - 1), (-1, len(rows) - 1), BG_LIGHT))
    t = Table(rows, colWidths=[9 * mm, CW - 9 * mm - 52 * mm - 15 * mm, 52 * mm, 15 * mm], repeatRows=1)
    t.setStyle(TableStyle(style))
    S.append(t)
    S.append(Spacer(1, 7))
    S.append(Paragraph(
        'Все материалы опубликованы на страницах соответствующих резидентов в разделе «База знаний». '
        'Каждая статья имеет собственный адрес и может быть отправлена ссылкой отдельно от страницы '
        'резидента.', SMALL))

    doc.build(S)
    return dict(path=out_path, articles=n_art, words=words, chars=chars,
                links=links, images=images)


def main():
    if len(sys.argv) < 2:
        sys.exit('Использование: python build_report.py <конфиг.json>')
    cfg_path = os.path.abspath(sys.argv[1])
    with open(cfg_path, encoding='utf-8') as f:
        cfg = json.load(f)
    cfg['__path__'] = cfg_path
    corpus = Corpus(load_source(cfg.get('source', 'working')))
    res = build(cfg, corpus)
    print('PDF: %s' % res['path'])
    print('Статей: %(articles)d | слов: %(words)d | знаков: %(chars)d | '
          'связей: %(links)d | иллюстраций: %(images)d' % res)


if __name__ == '__main__':
    main()
