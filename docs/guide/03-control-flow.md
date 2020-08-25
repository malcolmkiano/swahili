# Flow control Structures.

There are currently 2 control structures implemented:

1. If...else
2. If...else if... else

## If...else

Syntax: Kama (expr) { }Sivyo{ }

- Example:
  `kama (x>y) { x = 12} sivyo {x =3}`

## If...else if...else

Syntax: Kama (expr){ } Au (expr) { } Sivyo { }

- Example:
  `kama (x>y) { x = 12} au (x<z) {x =3.14} sivyo { x =3}`
