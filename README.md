# swahili

A new programming language to be written in Swahili to help teach programming concepts to swahili speaking students.

### Grammar

This will be updated as the language develops

| Node           | Constituents                                          |
| :------------- | :---------------------------------------------------- |
| **expr**       | KEYWORD:WACHA IDENTIFIER EQ `expr`                    |
|                | `comp-expr` ((AND/OR) `comp-expr`)\*                  |
| **comp-expr**  | NOT `comp-expr`                                       |
|                | `arith-expr` ((EE/LT/GT/LTE/GTE) `arith-expr`)\*      |
| **arith-expr** | `term` ((PLUS/MINUS) `term`)\*                        |
| **term**       | `factor` (MUL/DIV) `factor`)\*                        |
| **factor**     | (PLUS/MINUS) `factor`                                 |
|                | `power`                                               |
| **power**      | `atom` (POW `factor`)\*                               |
| **atom**       | INT/FLOAT/IDENTIFIER                                  |
|                | LPAREN `expr` RPAREN                                  |
|                | `if-expr`                                             |
| **if-expr**    | KEYWORD:KAMA `expr` LCURL `expr` RCURL                |
|                | (KEYWORD:AU `expr` LCURL `expr` RCURL)\*              |
|                | (KEYWORD:SIVYO LCURL `expr` RCURL)?                   |
| **for-expr**   | KEYWORD:KWA IDENTIFIER EQ `expr` KEYWORD:MPAKA `expr` |
|                | (KEYWORD:HATUA `expr`)? LCURL `expr` RCURL            |
| **while-expr** | KEYWORD:AMBAPO `expr` LCURL `expr` RCURL              |
