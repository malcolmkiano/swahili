# Numbers and Dates

## Numbers
The Number type in Swahili supports both floats and integers and only deals with numbers in base ten, ie, `decimal number system`

Examples of numeric literals are:
  `1,100, 3.14159, 2.71828`

To learn more about the possible operators that can act on numbers, check it out [here](./docs/guide/05-functions.md) 

##  Dates

The Keyword to access the date time class is `Tarehe()`. Entered with no parameters the `Tarehe()` functions returns the current  Date and time. You can use the following to format the output of the Tarehe() function.

```
    ms => millisecond
    se => Seconds
    d => minute
    sa => hour 12(01-12)
    SA => hour 24(00-23)
    t => date(01-31)
    s => day name(Jumapili[Sunday] -Jumamosi[Saturday])
    m => month number (01-12)
    M => month name (Januari- Desemba)
    mk => year short ('30-'20)
    MK => year long (1930-2020)
```

For Example:
```
    // Given today's date is May 21<sup>st</sup> 2019 at 1:23pm
    
    wacha leo = Tarehe()
    // Will print today's date & time
    andika(leo) 
        >> "21/5/2020 1:23"

    // Formatting the output 
    andika(Tarehe(leo,"t s M, MK, sa:d w"))
        >> "21 Alhamisi Mei 2020, 1:23 mchana"
```

In the english language, we segment the 12hr system day into am and pm. This maps so that midnight to midday is am and midday to midnight is pm. 
``` 
    00.00 - 11.59 => am
    12.00 - 23.59 => pm
```

However in the Swahili language, time is segmented differently. We have 5 distinct segements of day, that is:

```
    07.00-11.59 => asubuhi(morning)
    12.00-15.59 => mchana(afternoon)
    16.00-18.59 => jioni(evening)
    19.00-03.00 => usiku(night)
    04.00-06.00 => alfajiri(dawn)
```
As such the suffix for the 12 hour(am/pm) time system in swahili will be one of the following `Asubuhi`,`Mchana`,`Jioni`,`Usiku`,`Alfarjiri`. For Example: `1:09:24 Mchana` or `4:20:12 Alfajiri`