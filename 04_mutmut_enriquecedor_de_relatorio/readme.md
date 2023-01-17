adições:

```py
mut_indexes = {}
mut_log_files = "mut-types.txt"
```

...

```py
mutations_names = {
    'operator': 'operator',
    'keyword': 'keyword',
    'number': 'number',
    'name': 'name',
    'string': 'string',
    'argument': 'argument',
    'or_test': 'or_test',
    'and_test': 'and_test',
    'lambdef': 'lambdef',
    'expr_stmt': 'expr_stmt',
    'decorator': 'decorator',
    'annassign': 'annassign',
}
```

...

```py
mut_indexes[context.filename] = mut_indexes.get(context.filename,0)+1
# print(f'     -    {context.filename}: #{mut_indexes[context.filename]}: {node.type}')
write_file(f"{context.filename}:{mut_indexes[context.filename]}:{node.type}", "mut-types.txt")
# print(f' #{context.index}: {node.type} : {new}')
```

...

```py
def write_file(msg, file="log.txt", mode="a"):
    f = open(file, mode)
    f.write(str(msg)+"\n")
    f.close()
```
