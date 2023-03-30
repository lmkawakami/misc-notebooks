DEL .mutmut-cache
DEL mut-types.txt
mutmut run --paths-to-mutate app
@REM mutmut run --paths-to-mutate app --disable-mutation-types=expr_stmt
mutmut html
python mutmut_enrich_html.py
