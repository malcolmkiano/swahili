# Loops

Currently, 2 Loop structures have been implemented, namely:

- For Loops
- While Loops

## For loops

**Syntax 1**: Kwa - mpaka

- Example:

```
kwa y = 1 Mpaka 6 {
  andika(“Habari”) // will print "habari" to terminal five times
}

// => "Habari"
// => "Habari"
// => "Habari"
// => "Habari"
// => "Habari"
```

- The upper limit of the range is not included in the iteration. Hence `kwa i = 1 mpaka 3 { andika("Jambo")}` will only print `"Jambo"` twice.

You can also loop through a list using the kwa katika syntax instead

**Syntax 2**: Kwa - Katika

- Example:

```
kwa i katika ["Halima", "Maria", "Juma"]{
  andika(i) // Will print each element in the list
}

// => "Halima"
// => "Maria"
// => "Juma"
```

This syntax also works if you pass in a variable that holds a list. For instance:

```
  wacha majina = ["Halima", "Maria", "Juma"]
  kwa i katika majina{
    andika(i)
  }
```

You can also loop through each character in a string by passing that string or a variable name that holds a string as shown below

```
  kwa c katika "Juma"{
    andika(c)
  }

  // => "J"
  // => "u"
  // => "m"
  // => "a"
```

Basically, the Kwa...Katika syntax accepts list expressions, String expressions, identifiers or function calls to functions that evaluate to a list or a string.

## While Loops

Syntax: Ambapo (expr) { }

- Example:

```
wacha x = 0
ambapo (x > 2) {
  andika ("salamu") // Will print "salamu to terminal as long as x>2
  x = x + 1
}
```
