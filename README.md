# swahili

A new programming language to be written in Swahili to help teach programming concepts to swahili speaking students.

### Grammar

This will update with as the language develops

| Node           | Constituents                                        |
| :------------- | :-------------------------------------------------- |
| **expr**       | KEYWORD:WACHA IDENTIFIER EQ `expr`                  |
| -              | `comp-expr` ((KEYWORD:&&/KEYWORD:AU) `comp-expr`)\* |
| **comp-expr**  | ! `comp-expr`                                       |
| -              | `arith-expr` ((EE/LT/GT/LTE/GTE) `arith-expr`)\*    |
| **arith-expr** | `term` ((PLUS/MINUS) `term`)\*                      |
| **term**       | `factor` (MUL/DIV) `factor`)\*                      |
| **factor**     | (PLUS/MINUS) `factor`                               |
| -              | `power`                                             |
| **power**      | `atom` (POW `factor`)\*                             |
| **atom**       | INT/FLOAT/IDENTIFIER                                |
| -              | LPAREN `expr` RPAREN                                |
