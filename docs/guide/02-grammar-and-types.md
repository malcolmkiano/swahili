# Context Free Grammar For Swahili

## Variable Declaration BNF

Wacha {var_name} = {value}

```
  <assignment> ::= <var> <op> <value> <op>
  <var> ::= <chars>
  <value> ::= <chars> | <num> | <var> | <expr>
  <expr> ::= <value> <op><value>| <var> >op> <var>
  <op> ::= = | ; | + | - | * | % | / | **
  <chars> ::= <chars> | a | b | c | ... | z | _
  <num> ::= 0 | 1 | … | 9 | <num>
```

## Expressions BNF

```
  <expr> ::= <value>|<var>|<value> <op><value>| <var> >op> <var>
  <var> ::= <chars>
  <value> ::= <chars> | <num> | <var> | <expr>
  <op> ::= = | ; | + | - | * | % | / | **
  <chars> ::= <chars> | a | b | c | ... | z | _
  <num> ::= 0 | 1 | … | 9 | <num>
```

## Function declaration BNF

```
  shughuli     ::= <value>([<args_list>]) { <STMTS>}
  <args_list>    ::= <args>*
  <args>        ::= <value>
  <STMTS>     ::= <expr>*
  <value>     ::=  <chars> | <num> | <var> | <expr>
  <op>         ::=  = | ; | + | - | * | % | / | **
  <chars>     ::= <chars> | a | b | c | ... | z | _
  <num>     ::= 0 | 1 | … | 9 | <num>
```

## Flow control BNF

```

```

## Loops BNF

```

```

# Supported Data Types

Swahili Supports 4 data types:

- Integers
- Floats
- Booleans
- Strings

All are implicitly defined within the language. Type coercion is allowed from ints to floats but not the other way round.
