# Grammar and Data Types

## Basics
- Swahili borrows its syntax from javascript, python and ruby. Like Javascript, Swahili is case sensitive. as such the declarations
``` wacha x = 5
    wacha X = 3
 ```
 are entirely different variables. 
 - Lines can optionally end with a semi-colon like in javascript. 
 
## Comments
 
## Declarations
- To declare a variable, we use the keyword `wacha`
``` wacha x = 5
    wacha X = 3
 ```

## Variables
- Variables are used as symbolic names for values within the program. The names of variables, called **identifiers** must begin with either an underscore (`_` ), or an alphabetic character in either upper or lower case. Subsequent characters can be alphanumeric or an underscore. Hence:
```
wacha _jina = "Kiano" //valid
wacha Jina = "Kiano" //valid
wacha jina = "Kiano" //valid
wacha 0_jina = "Kiano" //invalid
```
- Swahili is case sensitive, hence, `Jina` and `jina` are different variables. 
- You can not use Swahli keywords as identifiers. 
```
  wacha kweli = uwongo //will raise an error because kweli is a swahili keyword
```

## Declaring Variables
- To declare a variable, we use the keyword `wacha`, followed by the identifier name and an initialization. You **have to** initialize your variables when you declare them. If you want a variable to be empty on declaration you intitalize it to null (tupu).
```
wacha jina //will raise an error
wacha jina = "" // is valid
wacha jina = tupu //initializes jina to null
```
- An attempt to access an undeclared variable results in a Runtime error. 
- You can not perform basic arithmetic and boolean operations on variables with a null value. 

## Variable Scope
- When running the swahili interpreter on the terminal, variables you declare within a global scope (Outside of any function) can not be redeclared, ie,
```
wacha x = 3
wacha x = 5 // this line will raise an error
x = 5 // this will not raise an error
```
- Variables declared inside a function block are only available for that block. For instance: 
```
x = "Outside block"
shughuli salamu_tatu(jina){
  wacha x = 3 //value of x here is 3
  andika(("Habari, "+ jina )*x)
 }
 salamu_tatu("Wendo")
 andika(x) //will print "Outside block"
 ```

## Constants


## Data Structures and types
- There are 5
  - Boolean: `kweli` that represents true and `uwongo` that represents false
  - null: `tupu` denotes a null value
  - Number: Could be both Integers and floats. For example `42` or `3.14159`
  - Strings: A sequence of characters that represents a text value. For example `Habari`
  - Lists: `Orodha`  an ordered collection of items. Can hold multiple data types: for example `[1,2,3] ` or `[1, "orodha", kweli]`

## List literals
- A list literal is a collection of zero or more expressions, each of which represents a list element enclosed in square brackets. The length of a list is set to the number of arguments specified. 
- The following creates a list of `vinywaji`
```
wacha vinywaji = ["chai", "kahawa ya Uhabeshi", "Kahawa ya Kenya" ] 
```
- Lists in Swahili are zero based, that is, the first element has the index of zero.

### Acessing Elements in a list
- Unlike most languages access a specific element in an array we put the index after a forward slash. For example
```
wacha vinywaji = ["chai", "kahawa ya Uhabeshi", "Kahawa ya Kenya" ] 
andika(vinywaji/0)
>>"chai"
andika(vinywaji/2)
>>"Kahawa ya Kenya"
```

### Appending elements to a list
-  To append an element to the end of a list we use the plus sign(```+```) followed by the element we want to add. For Example
```
vinywaji + "soda"
andika(vinywaji)
>>["chai", "kahawa ya Uhabeshi", "Kahawa ya Kenya", "soda" ] 
```

### Deleting elements in a list
- To delete an element in a list we use the `-` followed by the index of the element. For Example: 
```
vinywaji -3
andika(vinywaji)
>>["chai", "kahawa ya Uhabeshi", "Kahawa ya Kenya" ] 
```

### Concatenation of 2 lists
- We can combine 2 lists into one using an asterisk (`*`)
- For Example:
```
  wacha vyakula = ["maandazi", "wali", "mahamri"]
  wacha vyakula_vinywaji = vinywaji*vyakula
  andika(vyakula_vinywaji)
  >> ["chai", "kahawa ya Uhabeshi", "Kahawa ya Kenya", "maandazi", "wali", "mahamri"]  
```

### Length of a list
- To get the length of a list, (how many elements are in a list) we use the inbuilt function idadi() and pass the list as an argument. 
- For Example: 
```
idadi(vinywaji)
>> 3
```

## Boolean literals
- The boolean type has 2 literal values: `kweli` and `uwongo`

## Numeric literals
- The Number type contains both floats and integers. 
- Swahili deals only with numbers in base ten, ie, `decimal number system`
- Examples of numeric literals are:
`1,100, 3.14159, 2.71828`

## String literals
- A string literal is zero or more characters enclosed in double(`" "`) quotation marks. Swahili does not support use of single quotation marks to denote strings, hence `andika('Habari Dunia')` is invalid but `andika("Habari Dunia")` is valid. 

## Special Characters
- In addition to ordinary characters you can also include special characters in strings. 
- For Example
```
andika(" habari \n yako")
>> habari
   yako
```
- The charaters `\n` add a new line. The list of special characters is shown below

Character   |  Meaning            |
------------|---------------------|
\n          |  New line           |
\t          |  Tab space          |
\"          |  Double quote       |
\'          |  Single Quote       |
\ \|        |  Pipe symbol        |