# Swahili

A new programming language with semantics borrowed from the Swahili language to help teach programming concepts to native Swahili-speaking students.

![Version 0.9.8](https://img.shields.io/badge/version-0.9.8-blue)
[![Run on Repl.it](https://repl.it/badge/github/malcolmkiano/swahili)](https://repl.it/@moredigital/swahili-1)

## Get Started

### Installation

Swahili is built on Node. To get started, you can install Swahili, or follow the instructions to run without installing.

```
npm install -g swahili-lang
```

To start the REPL, just run `swahili` in your terminal.

```
swahili
```

Try things out! Here's a good command to get you started:

```swahili
> andika("Jambo Dunia! Hello, World!")
```

### External files

You can pass in a file path to be executed when you run the `swahili` command in your terminal:

```
swahili ./examples/jambo.swh
```

To see more options for the `swahili` command run

```
swahili -h
```

### Run without installing

If you'd like to run without installing, simply use:

```
npx swahili-lang [filename]
```

To enable syntax highlighting for your Swahili programs in VS Code (more coming soon!), get [this VS Code extension](https://marketplace.visualstudio.com/items?itemName=swahili-lang.swahili-syntax).

---

## Documentation

### Language Guide

1. [Introduction](./docs/guide/01-introduction.md)
2. [Grammar and types](./docs/guide/02-grammar-and-types.md)
3. [Control flow and error handling](./docs/guide/03-control-flow-and-error-handling.md)
4. [Loops and iterations](./docs/guide/04-loops.md)
5. [Functions](./docs/guide/05-functions.md)
6. [Expressions and operators](./docs/guide/06-expressions.md)
7. [Numbers and dates](./docs/guide/07-numbers-and-dates.md)

### References

- [Grammar](./docs/ref/grammar.md)
- [Built-in functions](./docs/ref/built-in-functions.md)
- [Constants](./docs/ref/constants.md)

---

## Examples

- [Jambo, Dunia! (Hello, World!)](./examples/jambo.swh)
- [Vitanzi (Loops)](./examples/vitanzi.swh)
- [Mraba (Squares)](./examples/mraba.swh)
- [FizzBuzz](./examples/fizzbuzz.swh)
- [Vyupa 99 (99 Bottles)](./examples/99.swh)
- [Mfuatano wa Fibonacci (Fibonacci Sequence)](./examples/fibonacci.swh)
- [Tarihi (To-do List)](./examples/tarihi.swh)
