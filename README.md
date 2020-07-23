# swahili
A new programming language to be written in Swahili

## BNF Used for the Variable declaration

Variable Declaration BNF
Let {var_name} =  {value}
  `code`
    <declaration> := <assignment>
    <assignment> := <var> <op> <value> <op> img & doc
    <var> := <chars>  
    <value> := <chars> | <num> | <var> | <expr> 
    <expr> := <value> <op><value>| <var> >op> <var>
    <op> := = | ; | + | - | * | % | / | ** 
    <chars> := <chars> | a | b | c | ... | z | _
    <num> := 0 | 1 | … | 9 | <num>
   `code`
        
x = 12 valid

12x not valid

x = 12 should generate the following parse tree

![alt text]("https://github.com/malcolmkiano/swahili/blob/master/img & doc/parseTree.png?raw=true")
