# Swahili

A new programming language with semantics borrowed from the Swahili language to help teach programming concepts to swahili speaking students.

![Version 0.5.2](https://img.shields.io/badge/version-0.5.2-blue)

## Get Started

### Installation

Swahili is built on Node. To get started, install swahili in your global scope (it doesn't really make sense to add it to a project just yet 🙂).

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

Or, if you're running the REPL, you can use the `anza` function, which takes the file path as its argument

```swahili
> anza("./path/to/your/file.swh")
```

To enable syntax highlighting for your Swahili programs in VS Code (more coming soon!), follow [this guide](./swahili-syntax/).

---

## Documentation

### Language Guide

1. [Introduction](./docs/guide/01-introduction.md)
2. [Grammar and types](./docs/guide/02-grammar-and-types.md)
3. [Control flow and error handling](./docs/guide/03-control-flow.md)
4. [Loops and iterations](./docs/guide/04-loops.md)
5. [Functions](./docs/guide/05-functions.md)
6. [Expressions and operators](./docs/guide/06-expressions.md)
7. [Numbers and dates](./docs/guide/07-numbers-and-dates.md)

### References

1. [Grammar](./docs/ref/grammar.md)
2. [Built-in functions](./docs/ref/built-in-functions.md)

---

## Examples

### Beginner

- [Jambo, Dunia! (Hello, World!)](./examples/jambo.swh)
- [Mraba (Squares)](./examples/)

### Intermediate

- [Mfuatano wa Fibonacci (Fibonacci Sequence)](./examples/fibonacci.swh)

### Advanced

- [Tarihi (To-do List)](./examples/tarihi.swh)
