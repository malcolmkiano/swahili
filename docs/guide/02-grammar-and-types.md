# Context Free Grammar For Swahili

## Variable Declaration BNF
Wacha {var_name} =  {value}
```
  <assignment>  ::= <var> <op> <value> <op> 
  <var>         ::= <chars>  
  <value>       ::= <chars> | <num> | <var> | <expr> 
  <expr>        ::= <value> <op><value>| <var> >op> <var>
  <op>          ::= = | ; | + | - | * | % | / | ** 
  <chars>       ::= <chars> | a | b | c | ... | z | _
  <num>         ::= 0 | 1 | … | 9 | <num>
```

## Expressions BNF
```
  <expr>  ::= <value>|<var>|<value> <op><value>| <var> >op> <var>
  <var>   ::= <chars>  
  <value> ::= <chars> | <num> | <var> | <expr> 
  <op>    ::= = | ; | + | - | * | % | / | ** 
  <chars> ::= <chars> | a | b | c | ... | z | _
  <num>   ::= 0 | 1 | … | 9 | <num>
```

## Function declaration BNF
```
  shughuli         ::= <value>([<args_list>]) { <STMTS>}
  <args_list>      ::= <args>*
  <args>           ::= <value>
  <STMTS>          ::= <expr>*
  <value>          ::=  <chars> | <num> | <var> | <expr> 
  <op>             ::=  = | ; | + | - | * | % | / | ** 
  <chars>          ::= <chars> | a | b | c | ... | z | _
  <num>            ::= 0 | 1 | … | 9 | <num>
```
## Flow control BNF
### if else
```If loop declaration BNF
If loop     ::= (condition) { <STMTS>} else {<STMTS>}
condition   ::= <expr>*
<STMTS>     ::= <expr>*
<expr>      ::= <value>|<var>|<value> <op><value>| <var> >op> <var>
<value>     ::=  <chars> | <num> | <var> | <expr> 
<op>        ::=  = | ; | + | - | * | % | / | ** 
<chars>     ::= <chars> | a | b | c | ... | z | _
<num>       ::= 0 | 1 | … | 9 | <num>
```
### if...else if... else
```
If else loop declaration BNF
If loop      ::= Kama (condition) { <STMTS>} au (condition) {<STMTS>}sivyo {<STMTS>}
condition    ::= <expr>*
<STMTS>      ::= <expr>*
<expr>       ::= <value>|<var>|<value> <op><value>| <var> >op> <var>
<value>      ::=  <chars> | <num> | <var> | <expr> 
<op>         ::=  = | ; | + | - | * | % | / | ** 
<chars>      ::= <chars> | a | b | c | ... | z | _
<num>        ::= 0 | 1 | … | 9 | <num>
```

## Loops BNF
### For Loop
```
For Loop      ::= KWA (<expr>) MPAKA (<expr>) {<STMTS>}
condition     ::= <expr>*
<STMTS>       ::= <expr>*
<expr>        ::= <value>|<var>|<value> <op><value>| <var> >op> <var>
<value>       ::=  <chars> | <num> | <var> | <expr> 
<op>          ::=  = | ; | + | - | * | % | / | ** 
<chars>       ::= <chars> | a | b | c | ... | z | _
<num>         ::= 0 | 1 | … | 9 | <num>
```
### While Loop
```
  While Loop    ::= ambapo (condition) { <STMTS>} 
  condition     ::= <expr>*
  <STMTS>       ::= <expr>*
  <expr>        ::= <value>|<var>|<value> <op><value>| <var> >op> <var>
  <value>       ::=  <chars> | <num> | <var> | <expr> 
  <op>          ::=  = | ; | + | - | * | % | / | ** 
  <chars>       ::= <chars> | a | b | c | ... | z | _
  <num>         ::= 0 | 1 | … | 9 | <num>
```

# Supported Data Types
Swahili Supports 4 data types: 
- Integers
- Floats
- Booleans 
- Strings

All are implicitly defined within the language. Type coercion is allowed from ints to floats but not the other way round. 
