DEL .mutmut-cache
DEL log.txt
DEL mut-types.txt
mutmut run --paths-to-mutate clock,foo
@REM mutmut run --paths-to-mutate foo
@REM mutmut run --paths-to-mutate foo --enable-mutation-types=expr_stmt
@REM mutmut run --paths-to-mutate foo --disable-mutation-types=string,argument
mutmut html
mutmut junitxml > mutmut.xml
python mutmut_score.py
python mutmut_enrich_html.py
DEL mut-types.txt