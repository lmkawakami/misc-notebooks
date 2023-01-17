from bs4 import BeautifulSoup
import pandas as pd

def trim(l):
    i = l[1:].index(l[0]) + 1
    return l[:i]

def split_path_index_types():
    f = open("mut-types.txt", "r")
    raw = f.read()
    f.close()
    muts = trim(raw.split("\n"))
    paths = []
    rel_indexes = []
    abs_indexes = []
    types = []
    for abs_index, mut in enumerate(muts):
        _path, _index, _type = mut.split(":")
        paths.append(_path)
        rel_indexes.append(_index)
        abs_indexes.append(abs_index+1)
        types.append(_type)
    return paths, rel_indexes, abs_indexes, types

def assemble_mut_tree(paths, abs_indexes, types):
    tree = {}
    for _path, _index, _type in zip(paths, abs_indexes, types):
        path_branch = tree.get(_path,{})
        path_branch[_index] = _type
        tree[_path] = path_branch
    return tree

def read_html(path):
    f = open(f"html/{path}.html", "r")
    html = f.read()
    f.close()
    return html

def write_html(path, content):
    f = open(f"html/{path}.html", "w")
    f.write(content)
    f.close()

def set_class(class_name, *elements):
    for element in elements:
        element['class'] = class_name

def link_stylesheet(soup):
    head = BeautifulSoup('<head><link rel="stylesheet" href="./../style.css" type="text/css"></head>')
    body = soup.find('body')
    body.insert_before(head)

def create_stylesheet():
    css = 'html{font-family:monospace;color:#ccd4db;background-color:#1f1d1d}table{padding:1em}td.type-count,th.type-count{border:1px solid #ddd;text-align:center;padding:8px;display:block}tr.type-count{float:left;display:block}a{color:#6289dc}a:visited{color:#ba66ea}.operator{color:#fa6060}.keyword{color:#faad60}.number{color:#fafa60}.name{color:#adfa60}.string{color:#60fa60}.argument{color:#60faad}.or_test{color:#60fafa}.and_test{color:#60adfa}.lambdef{color:#6060fa}.expr_stmt{color:#ad60fa}.decorator{color:#fa60fa}.annassign{color:#fa60ad}'
    f = open(f"html/style.css", "w")
    f.write(css)
    f.close()

def create_mutations_table(recurrency):
    headers = '<tr class="type-count"><th class="type-count">Mutant type</th><th class="type-count">Mutants count</th></tr>'
    rows = ""
    for _type, _count in recurrency.items():
        rows += f'<tr class="type-count"><td class="type-count">{_type}</td><td class="type-count">{_count}</td></tr>'
    return f'<table>{headers}{rows}</table><hr/>'

def insert_table(table, soup):
    _table = BeautifulSoup(table)
    soup.find('h3').insert_before(_table)

def count_recurency(lst, rec={}):
    for itm in lst:
        rec[itm] = rec.get(itm, 0) + 1
    return rec

paths, rel_indexes, abs_indexes, types = split_path_index_types()
mut_tree = assemble_mut_tree(paths, abs_indexes, types)
create_stylesheet()
total_recurrency = {}

for _path, muts in mut_tree.items():
    html = read_html(_path)
    soup = BeautifulSoup(html, 'html.parser')
    recurrency = count_recurency(muts.values())
    table = create_mutations_table(recurrency)
    total_recurrency = count_recurency(muts.values(), total_recurrency)
    insert_table(table, soup)
    link_stylesheet(soup)
    for h3 in soup.find_all('h3'):
        text = h3.string
        _index = int(text.split(" ")[-1])
        _type = muts[_index]
        h3.string = f'{text} - {_type}'
        pre = h3.findNextSibling()
        set_class(_type, h3, pre)
    
    write_html(_path, str(soup))

body_content = BeautifulSoup(f"<body>{read_html('index')}</body>", 'html.parser')
body = BeautifulSoup()
body.append(body_content)
soup = BeautifulSoup('<html><head><link href="./style.css" rel="stylesheet" type="text/css" /></head></html>')
soup.find('html').append(body)
files_table = soup.find('table')


table = pd.read_html(str(files_table))[0]
total = table["Total"].sum()
killed = table["Killed"].sum()
score = killed/total*100
survived = table["Survived"].sum()
print(total, killed, score, survived)
total_row = BeautifulSoup(f"<td><b>Total</b></td><td><b>{total}</b></td><td><b>{killed}</b></td><td><b>{score:.2f}</b></td><td><b>{survived}</b></td>")
files_table.append(total_row)

mutations_table = create_mutations_table(total_recurrency)
score_report = f"<h3>mutmut score: <u><b>{score:.2f}%</b></u></h3>"
table = BeautifulSoup(score_report+mutations_table)
body = soup.find('body')
body.append(table)
write_html('index', str(soup))