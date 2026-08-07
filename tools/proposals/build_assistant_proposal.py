# -*- coding: utf-8 -*-
"""
Предложение для руководства: ИИ-ассистент на сайте технопарка, сценарии использования.

    python tools/proposals/build_assistant_proposal.py

Оформление: технический минимализм в фирменной палитре сайта (src/index.css).
Segoe UI — текст, Consolas — технические метки и коды. Весь контент в структурах ниже.
"""
import io
import os

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Frame, NextPageTemplate, PageBreak,
                                PageTemplate, Paragraph, Spacer, Table, TableStyle)

OUT_DIR = os.path.join(os.path.dirname(__file__), 'out')
OUT = os.path.join(OUT_DIR, 'ИИ-ассистент_сценарии_Технопарк-1219.pdf')
COMPILED = '04.08.2026'
DOC_CODE = 'TP1219 / AI-ASSISTANT / v1.0'

# --- фирменная палитра (src/index.css) ---
INK      = colors.HexColor('#1F2933')   # основной тёмный
INK_SOFT = colors.HexColor('#2B2F36')
ACCENT   = colors.HexColor('#2F6FED')
ACCENT_L = colors.HexColor('#4A7FF0')
STEEL    = colors.HexColor('#6B7C8F')
BG_LIGHT = colors.HexColor('#F5F7F9')
BG_SOFT  = colors.HexColor('#E6EEF8')
HAIR     = colors.HexColor('#D9E1E8')
GRID_DK  = colors.HexColor('#2A3742')   # сетка на тёмном
COVER_MU = colors.HexColor('#8FA6C0')   # приглушённый текст на тёмном

FD = (os.environ.get('WINDIR', 'C:/Windows') + '/Fonts/').replace('\\', '/')
for alias, fname in [('S', 'segoeui.ttf'), ('SB', 'segoeuib.ttf'), ('SI', 'segoeuii.ttf'),
                     ('SL', 'segoeuil.ttf'), ('SSL', 'segoeuisl.ttf'),
                     ('M', 'consola.ttf'), ('MB', 'consolab.ttf')]:
    pdfmetrics.registerFont(TTFont(alias, FD + fname))
pdfmetrics.registerFontFamily('S', normal='S', bold='SB', italic='SI')

PW, PH = A4
ML = MR = 20 * mm
CW = PW - ML - MR

SECTIONS = [
    ('01', 'О чём речь'),
    ('02', 'Сценарии: посетитель сайта'),
    ('03', 'Сценарии: резидент технопарка'),
    ('04', 'Сценарии: руководство технопарка'),
    ('05', 'Границы применения'),
    ('06', 'Внедрение и ресурсы'),
]

# --------------------------------------------------------------------------- контент

INTRO = (
    'Речь идёт не о «чате на сайте». Предлагается инструмент, который решает три разные задачи '
    'для трёх разных групп: помогает посетителю дойти до заявки, даёт резиденту канал обращений '
    'с обратной связью, а руководству технопарка — данные о том, что на самом деле ищут люди, '
    'приходящие на сайт.'
)
KEY_IDEA = (
    'Телефон обслуживает тех, кто уже решился позвонить, — и обслуживает хорошо. Но это меньшинство '
    'посетителей. Человек, который пришёл из поиска в 23:40, читает техническую статью или '
    'сравнивает несколько площадок перед звонком, не позвонит: он либо найдёт ответ на сайте, либо '
    'уйдёт. Ассистент работает именно с этим молчаливым большинством и переводит «посмотрел и ушёл» '
    'в «оставил задачу».'
)
BASIS = (
    'Создавать содержание заново не нужно. За последние месяцы сайт наполнен: 97 статей базы знаний, '
    '129 позиций товаров и услуг по 9 активным направлениям. Ассистент опирается на этот материал — '
    'по сути, это способ заставить уже сделанную работу приносить обращения.'
)

FACTS = [('97', 'статей\nбазы знаний'), ('129', 'позиций товаров\nи услуг'),
         ('9', 'активных\nнаправлений'), ('12', 'резидентов\nна площадке')]

AUDIENCES = [
    ('Посетитель сайта', 'Инженер-консультант, доступный круглосуточно: помогает понять, кто из '
                         'резидентов решает его задачу, и правильно её сформулировать.', 'Больше заявок'),
    ('Резидент технопарка', 'Канал обращений плюс ежемесячный отчёт о том, что спрашивают клиенты '
                            'и чего не хватает в его описаниях.', 'Ценность аренды'),
    ('Руководство', 'Данные о спросе: какие направления ищут, чего на площадке нет, сколько людей '
                    'интересуется арендой.', 'Основа для решений'),
]

VISITOR = [
    ('Подбор исполнителя по описанию задачи',
     'Посетитель пишет своими словами: «нужно 200 кронштейнов из трёшки, гнутые, покрашенные '
     'в чёрный». Ассистент раскладывает задачу на операции — лазерная резка, гибка, порошковая '
     'покраска, — показывает нужные услуги конкретного резидента и предлагает оформить заявку.',
     'Клиенту не нужно знать, что его задача называется «металлообработка» и кто из двенадцати '
     'резидентов ею занимается.'),
    ('Задача через нескольких резидентов сразу',
     '«Нужен металлический шкаф с вентиляционными решётками, покрашенный, 20 штук». Ассистент '
     'собирает решение из трёх резидентов — металлообработка, покраска, вентиляция — и формирует '
     'одну заявку.',
     'Сайт продаёт не список арендаторов, а полный производственный цикл. Единственный сценарий, '
     'который невозможно повторить отдельно взятой компании.'),
    ('Интервью для сбора технического задания',
     'Ассистент задаёт отраслевой перечень вопросов, а не «опишите задачу». Для рукава высокого '
     'давления — внутренний диаметр, рабочее давление, длина, тип и угол фитингов, рабочая среда. '
     'Для лазерной резки — марка и толщина металла, тираж, нужна ли гибка, требования к кромке.',
     'Резидент получает заявку, по которой сразу можно считать, вместо переписки в три круга.'),
    ('Заявка по фотографии',
     'Клиент фотографирует порванный рукав, сломанную деталь или узел на технике. Ассистент '
     'определяет тип изделия, подсказывает, что дополнительно нужно измерить, и прикрепляет фото '
     'к заявке.',
     'Наглядно для клиента и честно: ассистент прямо говорит, что точные размеры по фотографии '
     'снять нельзя.'),
    ('Разбор загруженного чертежа',
     'Клиент загружает файл чертежа. Система определяет габариты, толщину, длину реза и количество '
     'отверстий, выдаёт техническую сводку и передаёт резиденту готовую спецификацию.',
     'Снимает круг переписки «пришлите файл — какая толщина — сколько штук».'),
    ('Приём обращений вне рабочего времени',
     'Вечер, выходные, праздники. Ассистент принимает задачу, задаёт уточняющие вопросы, к началу '
     'рабочего дня заявка с контактами уже оформлена.',
     'Прямой ответ на возражение «у нас есть телефон»: в 22:40 телефон не отвечает.'),
    ('Честный ответ «этого мы не делаем»',
     '«Делаете ли вы гальванику?» Ассистент честно отвечает, что такого направления на площадке нет, '
     'предлагает ближайшее из имеющегося и фиксирует запрос.',
     'Посетитель не чувствует себя обманутым, а технопарк получает данные о неудовлетворённом спросе.'),
    ('Вопрос прямо из статьи базы знаний',
     'Читатель статьи про тормозные трубки спрашивает: «а мне такую сделают?» Ассистент отвечает '
     'в контексте статьи и ведёт к соответствующей услуге.',
     '97 статей перестают быть тупиком для трафика из поиска: сейчас человек читает и уходит.'),
    ('Помощь с выбором внутри линейки',
     '«Баня 20 или 30 футов?», «профлист какой толщины под мой пролёт?», «какая технология печати '
     'подойдёт для этой детали?» Ассистент задаёт два-три уточняющих вопроса и рекомендует, опираясь '
     'на статьи резидентов.',
     'Снимает сомнение, из-за которого покупка откладывается «на подумать».'),
    ('Вопрос об аренде помещения',
     'Ассистент отвечает честным минимумом — площади от 50 м², расположение, инфраструктура, телефон '
     'дирекции — и фиксирует, какую площадь и подо что искали.',
     'Потребность в аренде перестаёт быть предметом ощущений и становится цифрой.'),
    ('Вакансии',
     'Подбор подходящей вакансии по специальности соискателя, ответы на вопросы об условиях, '
     'оформление отклика.',
     'Закрывает поток соискателей без отвлечения сотрудников.'),
]

RESIDENT = [
    ('Ежемесячный отчёт «о чём вас спрашивали»',
     'Резидент получает сводку: сколько было обращений, какие услуги спрашивали чаще всего, какие '
     'вопросы остались без ответа и каких сведений не хватает в его карточках.',
     'Аренда на площадке — это не только квадратные метры, но и работающий канал продаж с обратной '
     'связью. Повод остаться и повод рекомендовать технопарк.'),
    ('Сигнал об устаревших данных',
     'Ассистент точен ровно настолько, насколько актуальны сведения резидента. Если по услуге '
     'регулярно спрашивают то, чего нет в описании, резидент получает уведомление.',
     'Каталог поддерживается в актуальном состоянии самими резидентами, а не администратором сайта.'),
]

MANAGEMENT = [
    ('Карта спроса',
     'Все обращения сводятся в таблицу: какие направления спрашивают, чего на площадке нет, сколько '
     'таких запросов в месяц. Например: «гальваника — 34 запроса за квартал».',
     'Потребность в новых направлениях выявляется автоматически и в числах. При переговорах с будущим '
     'арендатором появляется весомый аргумент: спрос на его продукцию уже приходит на площадку.'),
    ('Цифры, которых сегодня нет',
     'Сколько людей интересуется услугами резидентов, в какое время суток, по каким направлениям, '
     'какая доля доходит до заявки, на каком месте обрывается разговор.',
     'Через месяц работы появляется база для сравнения и оценки эффективности сайта, которой сейчас '
     'не существует.'),
    ('План публикаций на основе реальных вопросов',
     'Вопросы, на которые ассистент не нашёл ответа, превращаются в темы новых статей базы знаний.',
     'Ежемесячная работа над содержанием сайта опирается на запросы аудитории, а не на экспертное '
     'предположение.'),
]

LIMITS = [
    ('Цены и сроки', 'Не называет — их нет на сайте. Вместо этого оформляет заявку и передаёт её адресату.'),
    ('Обязательства', 'Не даёт обещаний от лица резидентов: работу выполняет резидент, ассистент только собирает задачу.'),
    ('Номенклатура', 'Не выдумывает. Отвечает строго по каталогу и статьям сайта, при отсутствии ответа честно сообщает об этом.'),
    ('Замена людей', 'Не заменяет телефон и менеджера, а работает с теми, кто звонить не станет.'),
    ('Персональные данные', 'Не собирает сверх того, что человек сам оставляет для обратной связи.'),
]

STAGES = [
    ('I', 'SC-01, 03, 06, 07, 08, 10\nи вся аналитика SC-14…16',
     'Работает на существующих данных сайта, дополнительных сведений не требует'),
    ('II', 'SC-02, 04, 09, 11',
     'Наиболее наглядные сценарии, требуют отладки на реальных обращениях'),
    ('III', 'SC-05, 12, 13',
     'Отдельная разработка, имеет смысл после подтверждения спроса'),
]

NEEDS = [
    ('Серверная часть', 'Один сервис-посредник между сайтом и языковой моделью, хранение истории '
                        'обращений и аналитики.'),
    ('Языковая модель', 'Google Cloud, тарификация по объёму обращений. При ожидаемом трафике сайта '
                        'расходы измеряются единицами долларов в месяц.'),
    ('Ответственный', 'Еженедельный просмотр диалогов и корректировка ответов. Без этого качество '
                      'ответов со временем снижается незаметно для всех.'),
]

DIALOG_EXAMPLE = [
    ('q', 'Нужен рукав на экскаватор.'),
    ('a', 'Подберём. Подскажите внутренний диаметр и рабочее давление — они указаны в маркировке '
          'вдоль оболочки рукава.'),
    ('q', 'DN12, 250 бар.'),
    ('a', 'Принято. Какая длина и тип наконечников — прямые или угловые? Если рукав сохранился, '
          'проще привезти его как образец: подберём точный аналог без замеров.'),
]

# --------------------------------------------------------------------------- стили


def stl(name, **kw):
    base = dict(fontName='S', fontSize=9.3, leading=14.2, textColor=INK)
    base.update(kw)
    return ParagraphStyle(name, **base)


SEC_NO   = stl('SecNo', fontName='MB', fontSize=20, leading=22, textColor=HAIR)
SEC_TTL  = stl('SecTtl', fontName='SB', fontSize=16.5, leading=20, textColor=INK)
LEAD     = stl('Lead', fontName='SL', fontSize=12, leading=18, textColor=INK, alignment=TA_JUSTIFY)
BODY     = stl('Body', alignment=TA_JUSTIFY, spaceAfter=6)
SC_CODE  = stl('ScCode', fontName='MB', fontSize=8.5, leading=12, textColor=ACCENT)
SC_TTL   = stl('ScTtl', fontName='SB', fontSize=10.5, leading=14, textColor=INK)
SC_BODY  = stl('ScBody', fontSize=9.2, leading=13.6, textColor=INK)
SC_VAL   = stl('ScVal', fontSize=9, leading=13.2, textColor=STEEL)
LBL      = stl('Lbl', fontName='M', fontSize=6.8, leading=9, textColor=STEEL)
TH       = stl('Th', fontName='M', fontSize=7, leading=10, textColor=STEEL)
CELL     = stl('Cell', fontSize=9.2, leading=13.4)
CELLB    = stl('CellB', fontName='SB', fontSize=9.2, leading=13.4)
SMALL    = stl('Small', fontSize=8.3, leading=12, textColor=STEEL)
DLG_Q    = stl('DlgQ', fontName='SB', fontSize=9.2, leading=13.6, textColor=INK)
DLG_A    = stl('DlgA', fontSize=9.2, leading=13.6, textColor=STEEL)
FACT_N   = stl('FactN', fontName='SL', fontSize=27, leading=29, textColor=ACCENT)
FACT_L   = stl('FactL', fontSize=7.6, leading=10.4, textColor=STEEL)

TOTAL_PAGES = 0  # заполняется на первом проходе


# --------------------------------------------------------------------------- элементы
def section(no, title, space_before=0):
    """Заголовок раздела: крупный номер моноширинным + название + тонкая линия."""
    t = Table([[Paragraph(no, SEC_NO), Paragraph(title, SEC_TTL)]],
              colWidths=[14 * mm, CW - 14 * mm])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), space_before), ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LINEBELOW', (0, 0), (-1, -1), 1.2, INK),
    ]))
    return t


def scenarios(items, start=1):
    """Карточки сценариев: код SC-NN, заголовок, описание, строка «что даёт»."""
    rows, style = [], [
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (0, -1), 0), ('RIGHTPADDING', (0, 0), (0, -1), 6),
        ('LEFTPADDING', (1, 0), (1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 9), ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('LINEBELOW', (0, 0), (-1, -2), 0.4, HAIR),
    ]
    for i, (head, body, value) in enumerate(items):
        inner = Table(
            [[Paragraph(head, SC_TTL)],
             [Paragraph(body, SC_BODY)],
             [Table([[Paragraph('ЧТО ДАЁТ', LBL), Paragraph(value, SC_VAL)]],
                    colWidths=[18 * mm, CW - 18 * mm - 18 * mm],
                    style=TableStyle([
                        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                        ('TOPPADDING', (0, 0), (-1, -1), 1), ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
                        ('TOPPADDING', (0, 0), (0, 0), 2.5),
                    ]))]],
            colWidths=[CW - 18 * mm],
            style=TableStyle([
                ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, 0), 3),
                ('BOTTOMPADDING', (0, 1), (0, 1), 5),
            ]))
        rows.append([Paragraph('SC-%02d' % (start + i), SC_CODE), inner])
    t = Table(rows, colWidths=[18 * mm, CW - 18 * mm])
    t.setStyle(TableStyle(style))
    return t


def dialog_box(label, lines):
    """Врезка: акцентная линия слева. kind: q — реплика клиента, a — ответ, p — обычный абзац."""
    inner = [[Paragraph(label, LBL)]]
    for kind, text in lines:
        prefix = '' if kind == 'p' else '— '
        inner.append([Paragraph(prefix + text, DLG_Q if kind == 'q' else DLG_A)])
    body = Table(inner, colWidths=[CW - 12 * mm], style=TableStyle([
        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5), ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('TOPPADDING', (0, 0), (0, 0), 0), ('BOTTOMPADDING', (0, 0), (0, 0), 6),
    ]))
    t = Table([[body]], colWidths=[CW])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('LINEBEFORE', (0, 0), (0, -1), 2, ACCENT),
        ('LEFTPADDING', (0, 0), (-1, -1), 10), ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 9), ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
    ]))
    return t


def note_box(text):
    t = Table([[Paragraph(text, SC_VAL)]], colWidths=[CW])
    t.setStyle(TableStyle([
        ('LINEBEFORE', (0, 0), (0, -1), 2, ACCENT),
        ('LEFTPADDING', (0, 0), (-1, -1), 10), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 2), ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    return t


def hair_table(rows, widths, head=None, zebra=False):
    data = []
    if head:
        data.append([Paragraph(h.upper(), TH) for h in head])
    data += rows
    t = Table(data, colWidths=widths, repeatRows=1 if head else 0)
    style = [
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 7), ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LINEBELOW', (0, 0), (-1, -2), 0.4, HAIR),
    ]
    if head:
        style += [('LINEBELOW', (0, 0), (-1, 0), 1, INK),
                  ('TOPPADDING', (0, 0), (-1, 0), 0), ('BOTTOMPADDING', (0, 0), (-1, 0), 5)]
    if zebra:
        style.append(('LINEBELOW', (0, 0), (-1, -1), 0.4, HAIR))
    t.setStyle(TableStyle(style))
    return t


# --------------------------------------------------------------------------- страницы
def draw_grid(canv):
    """Едва заметная чертёжная сетка на тёмной обложке."""
    canv.setStrokeColor(GRID_DK)
    canv.setLineWidth(0.3)
    step = 10 * mm
    x = step
    while x < PW:
        canv.line(x, 0, x, PH)
        x += step
    y = step
    while y < PH:
        canv.line(0, y, PW, y)
        y += step


def corner_marks(canv, color, inset=10 * mm, length=5 * mm, width=0.6):
    canv.setStrokeColor(color)
    canv.setLineWidth(width)
    for x, sx in ((inset, 1), (PW - inset, -1)):
        for y, sy in ((inset, 1), (PH - inset, -1)):
            canv.line(x, y, x + sx * length, y)
            canv.line(x, y, x, y + sy * length)


def cover(canv, doc):
    canv.saveState()
    canv.setFillColor(INK)
    canv.rect(0, 0, PW, PH, stroke=0, fill=1)
    draw_grid(canv)
    corner_marks(canv, colors.HexColor('#3B4B5A'))

    # верхняя метка
    canv.setFont('M', 7.5)
    canv.setFillColor(COVER_MU)
    canv.drawString(ML, PH - 24 * mm, DOC_CODE)
    canv.drawRightString(PW - MR, PH - 24 * mm, 'ПРЕДЛОЖЕНИЕ К ОБСУЖДЕНИЮ')
    canv.setStrokeColor(colors.HexColor('#3B4B5A'))
    canv.setLineWidth(0.5)
    canv.line(ML, PH - 27 * mm, PW - MR, PH - 27 * mm)

    # заголовок
    canv.setFillColor(colors.white)
    canv.setFont('SL', 40)
    canv.drawString(ML, PH - 78 * mm, 'ИИ-ассистент')
    canv.setFont('SB', 40)
    canv.drawString(ML, PH - 95 * mm, 'на сайте')
    canv.setFillColor(ACCENT)
    canv.setLineWidth(2.5)
    canv.setStrokeColor(ACCENT)
    canv.line(ML, PH - 103 * mm, ML + 28 * mm, PH - 103 * mm)
    canv.setFont('S', 14)
    canv.setFillColor(COVER_MU)
    canv.drawString(ML, PH - 114 * mm, 'Сценарии использования')
    canv.setFont('S', 10.5)
    canv.setFillColor(colors.HexColor('#7C93AD'))
    canv.drawString(ML, PH - 127 * mm,
                    'Шестнадцать сценариев: что ассистент делает для посетителя сайта,')
    canv.drawString(ML, PH - 133 * mm,
                    'для резидента и для руководства технопарка')

    # содержание
    canv.setFont('M', 7.5)
    canv.setFillColor(colors.HexColor('#6F86A0'))
    canv.drawString(ML, PH - 152 * mm, 'СОДЕРЖАНИЕ')
    y = PH - 161 * mm
    for no, title in SECTIONS:
        canv.setFont('M', 8.5)
        canv.setFillColor(ACCENT_L)
        canv.drawString(ML, y, no)
        canv.setFont('S', 10.5)
        canv.setFillColor(colors.HexColor('#D6E2EF'))
        canv.drawString(ML + 12 * mm, y, title)
        canv.setStrokeColor(colors.HexColor('#333F4B'))
        canv.setLineWidth(0.4)
        canv.line(ML, y - 3.5 * mm, PW - MR, y - 3.5 * mm)
        y -= 9 * mm

    # подвал обложки
    canv.setStrokeColor(colors.HexColor('#3B4B5A'))
    canv.setLineWidth(0.5)
    canv.line(ML, 30 * mm, PW - MR, 30 * mm)
    canv.setFont('SB', 10.5)
    canv.setFillColor(colors.white)
    canv.drawString(ML, 22 * mm, 'Промышленный технопарк «1219»')
    canv.setFont('S', 9.5)
    canv.setFillColor(COVER_MU)
    canv.drawString(ML, 17 * mm, 'г. Троицк, Челябинская область')
    canv.setFont('M', 8)
    canv.drawRightString(PW - MR, 17 * mm, COMPILED)
    canv.restoreState()


def inner(canv, doc):
    canv.saveState()
    canv.setFont('M', 7)
    canv.setFillColor(STEEL)
    canv.drawString(ML, PH - 15 * mm, 'ТЕХНОПАРК 1219')
    canv.drawRightString(PW - MR, PH - 15 * mm, 'ИИ-АССИСТЕНТ · СЦЕНАРИИ ИСПОЛЬЗОВАНИЯ')
    canv.setStrokeColor(HAIR)
    canv.setLineWidth(0.5)
    canv.line(ML, PH - 17.5 * mm, PW - MR, PH - 17.5 * mm)
    canv.line(ML, 15 * mm, PW - MR, 15 * mm)
    canv.setFont('M', 7.5)
    canv.setFillColor(STEEL)
    canv.drawString(ML, 11 * mm, DOC_CODE)
    n = canv.getPageNumber()
    total = TOTAL_PAGES or n
    canv.setFont('M', 8)
    canv.setFillColor(STEEL)
    canv.drawRightString(PW - MR, 11 * mm, '/ %02d' % total)
    canv.setFont('MB', 8)
    canv.setFillColor(INK)
    canv.drawRightString(PW - MR - 8 * mm, 11 * mm, '%02d' % n)
    canv.restoreState()


# --------------------------------------------------------------------------- сборка
def story():
    S = [NextPageTemplate('Inner'), PageBreak()]

    # 01 — О чём речь
    S.append(section('01', 'О чём речь'))
    S.append(Spacer(1, 9))
    S.append(Paragraph(INTRO, LEAD))
    S.append(Spacer(1, 8))
    S.append(dialog_box('КЛЮЧЕВОЕ СООБРАЖЕНИЕ', [('p', KEY_IDEA)]))
    S.append(Spacer(1, 9))
    S.append(Paragraph(BASIS, BODY))
    S.append(Spacer(1, 6))

    cells = [[Paragraph(v, FACT_N) for v, _ in FACTS],
             [Paragraph(l.replace('\n', '<br/>'), FACT_L) for _, l in FACTS]]
    t = Table(cells, colWidths=[CW / 4.0] * 4)
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, 0), 'BOTTOM'), ('VALIGN', (0, 1), (-1, 1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, 0), 4), ('BOTTOMPADDING', (0, 0), (-1, 0), 2),
        ('TOPPADDING', (0, 1), (-1, 1), 0), ('BOTTOMPADDING', (0, 1), (-1, 1), 6),
        ('LINEABOVE', (0, 0), (-1, 0), 1, INK),
        ('LINEBELOW', (0, 1), (-1, 1), 0.4, HAIR),
        ('LINEAFTER', (0, 0), (-2, -1), 0.4, HAIR),
    ]))
    S.append(t)
    S.append(Spacer(1, 4))
    S.append(Paragraph('Содержание сайта, на которое опирается ассистент', SMALL))

    S.append(Spacer(1, 13))
    S.append(Paragraph('Кому и что это даёт', SC_TTL))
    S.append(Spacer(1, 6))
    rows = [[Paragraph(w, CELLB), Paragraph(d, CELL), Paragraph(r, CELLB)] for w, d, r in AUDIENCES]
    S.append(hair_table(rows, [38 * mm, CW - 38 * mm - 34 * mm, 34 * mm],
                        head=['группа', 'что получает', 'результат']))

    # 02 — посетитель
    S.append(PageBreak())
    S.append(section('02', 'Сценарии: посетитель сайта'))
    S.append(Spacer(1, 6))
    S.append(scenarios(VISITOR[:3], start=1))
    S.append(Spacer(1, 10))
    S.append(dialog_box('ПРИМЕР ДИАЛОГА · SC-03', DIALOG_EXAMPLE))
    S.append(Spacer(1, 10))
    S.append(scenarios(VISITOR[3:], start=4))

    # 03 — резидент
    S.append(PageBreak())
    S.append(section('03', 'Сценарии: резидент технопарка'))
    S.append(Spacer(1, 6))
    S.append(scenarios(RESIDENT, start=12))

    # 04 — руководство
    S.append(Spacer(1, 16))
    S.append(section('04', 'Сценарии: руководство технопарка'))
    S.append(Spacer(1, 6))
    S.append(scenarios(MANAGEMENT, start=14))
    S.append(Spacer(1, 10))
    S.append(dialog_box('ЧТО ЭТО ДАЁТ НА ПРАКТИКЕ', [(
        'p', 'Если за квартал тридцать четыре человека спросили о гальванике, которой на площадке '
             'нет, — это не строчка в журнале, а подтверждённый спрос, который сегодня уходит '
             'к конкурентам. При переговорах с потенциальным арендатором такой аргумент весомее '
             'описания инфраструктуры: спрос на его продукцию уже приходит на площадку.')]))

    # 05 — границы
    S.append(PageBreak())
    S.append(section('05', 'Границы применения'))
    S.append(Spacer(1, 8))
    S.append(Paragraph(
        'Ограничения заданы намеренно: они защищают технопарк и резидентов от неверных обещаний '
        'клиенту.', BODY))
    S.append(Spacer(1, 2))
    rows = [[Paragraph(a, CELLB), Paragraph(b, CELL)] for a, b in LIMITS]
    S.append(hair_table(rows, [42 * mm, CW - 42 * mm]))

    # 06 — внедрение
    S.append(Spacer(1, 16))
    S.append(section('06', 'Внедрение и ресурсы'))
    S.append(Spacer(1, 8))
    rows = []
    for a, b, c in STAGES:
        rows.append([Paragraph(a, stl('Rm', fontName='MB', fontSize=11, textColor=ACCENT)),
                     Paragraph(b.replace('\n', '<br/>'), CELL), Paragraph(c, SMALL)])
    S.append(hair_table(rows, [12 * mm, CW - 12 * mm - 62 * mm, 62 * mm],
                        head=['этап', 'сценарии', 'примечание']))
    S.append(Spacer(1, 6))
    S.append(note_box(
        'Аналитику (SC-14…16) следует включить в первый этап: сверх ведения истории обращений она '
        'почти ничего не стоит, но именно она через месяц даст ответы на вопросы, на которые сегодня '
        'в технопарке ответить нечем.'))

    S.append(Spacer(1, 14))
    S.append(Paragraph('Что потребуется', SC_TTL))
    S.append(Spacer(1, 6))
    rows = [[Paragraph(a, CELLB), Paragraph(b, CELL)] for a, b in NEEDS]
    S.append(hair_table(rows, [42 * mm, CW - 42 * mm]))
    S.append(Spacer(1, 10))
    S.append(Paragraph(
        'Предложение открыто к обсуждению: состав первого этапа можно сузить до двух-трёх сценариев, '
        'чтобы оценить отдачу на небольшом объёме работ.', BODY))
    return S


def make(target):
    doc = BaseDocTemplate(target, pagesize=A4, leftMargin=ML, rightMargin=MR,
                          topMargin=22 * mm, bottomMargin=20 * mm,
                          title='ИИ-ассистент на сайте: сценарии использования — Технопарк 1219',
                          author='Технопарк 1219', subject='Предложение к обсуждению')
    doc.addPageTemplates([
        PageTemplate(id='Cover', frames=[Frame(ML, 20 * mm, CW, PH - 60 * mm, id='c')], onPage=cover),
        PageTemplate(id='Inner', frames=[Frame(ML, 20 * mm, CW, PH - 42 * mm, id='i')], onPage=inner),
    ])
    doc.build(story())
    return doc.page


os.makedirs(OUT_DIR, exist_ok=True)
TOTAL_PAGES = make(io.BytesIO())   # первый проход — узнаём число страниц
make(OUT)
print('PDF:', OUT, '| страниц:', TOTAL_PAGES)
