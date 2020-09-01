# Loops

Currently, 2 Loop structures have been implemented, namely:

- For Loops
- While Loops

## For loops

**Syntax 1**: Kwa - mpaka

- Example:

```
kwa y = 1 Mpaka 10 {
  andika(“Habari”) //will print "habari" to terminal ten times
 }
```

You can also loop through a list using the kwa katika syntax instead

<<<<<<< Updated upstream
**Syntax 2**: Kwa - Katika

- Example:

=======
**Syntax 2**: Kwa - Katika 
- Example:
>>>>>>> Stashed changes
```
  kwa i katika ["Malcolm", "Patrick", "Kiano"]{
    andika(i)
  }
    >> "Malcolm"
    >> "Patrick"
    >> "Kiano"
```
<<<<<<< Updated upstream

This syntax also works if you pass in a variable that holds a list. For instance:

=======
This syntax also works if you pass in a variable that holds a list. For instance: 
>>>>>>> Stashed changes
```
  wacha majina = ["Malcolm", "Patrick", "Kiano"]
  kwa i katika majina{
    andika(i)
  }
```
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
You can also loop through each character in a string by passing that string or a variable name that holds a string as shown below

```
  kwa c katika "Kiano"{
    andika(c)
  }

    >>"K"
    >>"i"
    ...
    >>"o"
```

<<<<<<< Updated upstream
Basically, the Kwa...Katika syntax accepts list expressions, String expressions, identifiers or function calls to functions that evaluate to a list or a string.
=======
Basically, the Kwa...Katika syntax accepts list expressions, String expressions, identifiers or function calls to functions that evaluate to a list or a string. 
>>>>>>> Stashed changes

## While Loops

Syntax: Ambapo (expr) { }

- Example:

```
ambapo (x>2) {
  andika ("salamu") //Will print "salamu to terminal as long as x>2
}
```
