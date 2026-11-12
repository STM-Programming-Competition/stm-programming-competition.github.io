# 2025 IP Track Problems

> Original problem statements in English.

---

## Level 1: The Gate of Prime Sigils

The first trial is the gateway itself. It is sealed by a complex magical lock that responds only to special numbers known as "Prime Sigils." An inscription carved into the archway reveals the secret: a Prime Sigil is a number that is both a prime and a palindrome.

To deactivate the barrier, you must identify all Prime Sigils operating within the range [a, b]. Write a program to find all palindromic primes in the range [a, b].

### Definition 1: Prime Number

A prime number (or a prime) is a natural number greater than 1 that has no positive divisors other than 1 and itself, such as 2, 3, 5, 7 and so on.

### Definition 2: Palindrome

A palindrome is a natural number that reads the same forwards and backwards, like 151, 12321, 4334 and so on.

### 1.1 Input Format

The first line contains two positive integers a and b.

### 1.2 Output Format

Output a list of palindromic primes, one per line.

### 1.3 Sample IO

### Input

```text
5 500
```

### Output

```text
5
7
11
101
131
151
181
191
313
353
373
383
```

### 1.4 Data Range

For this problem, [a, b] denotes the set of natural numbers ≥a and ≤b, where 5 ≤a < b ≤ 100, 000, 000.

---

## Level 2: The Scroll of Unveiling

The text on the scroll is a powerful incantation, but it’s written in an ancient, compressed runic language used by the Citadel’s builders to save space on their enchanted artifacts. Only by deciphering the full, decompressed chant can you command the Inner Sanctum doors to open.

The builders’ compression rule is as follows: several consecutive identical substrings X are compressed into the form [DX] (D is an integer and 1 ≤D ≤99). For example, the string CBCBCBCB is compressed to [4CB] or [2[2CB]].

The builders call a compressed string like [2[2CB]] a double compression since it involves the compression of an already compressed string. As a further example, the builders would refer to [2[2[2CB]]] as a triple compression.

Now we give you the compressed incantation from the scroll. You must decompress it to reveal the true words of power.

### Notes

It is guaranteed to contain only digits, uppercase letters, [ and ].

### 2.1 Input Format

Input one line, a string, representing the compressed incantation.

### 2.2 Output Format

Output one line, a string, representing the decompressed result.

### 2.3 Sample IO

### Input

```text
AC[3FUN]
```

### Output

```text
ACFUNFUNFUN
```

### Hints

You must pay attention to the following inputs and corresponding outputs. They will occur rarely, but you must account for them if you want full marks.

- `CD[1HN]` <=> `CDHN`
- `CD8HN` <=> `CD8HN`
- `HN3[2CD]` <=> `HN3CDCD`
- `[13IP]` <=> `IPIPIPIPIPIPIPIPIPIPIPIPIP`
- `[2[2IP]]HN[2CD]6` <=> `IPIPIPIPHNCDCD6`

### 2.4 Data Range

For at least 50% of the data: The length of the decompressed string is no more than 100 characters, with at most triple compression. For 100% of the data: The length of the decompressed string is no more than 5000 characters, with at most ten levels of compression.

---

## Level 3: The Guardian’s Tribute

You speak the final, decompressed word of the incantation. With a deep grinding of stone, the massive doors to the Inner Sanctum rumble open. The final chamber is lit by a single, massive crystal. Seated on a throne before it is the Citadel’s Guardian, an ancient elemental being.

The Guardian demands some crystals from you to exchange the Citadel’s secrets. It wants to know that you are prepared for any eventuality.

You have access to N types of "Essence Crystals", each representing a specific numerical value (positive integer), and you can take an unlimited quantity of each from the magical field around you.

To prove your efficiency, you must carry as few crystals as possible, while still being able to form any value from 1 to X. The Guardian will test you by asking for a random value in this range (1 ≤value ≤X). You must ensure that the subset of crystals you carry can sum up to any requested value.

What is the minimum number of Essence Crystals you must carry to pass this final trial?

### 3.1 Input Format

The first line contains two integers X, N. The next N integers denote the denomination of each type of Essence Crystal.

### 3.2 Output Format

Output the minimum number of crystals you need to carry. If there is no solution, the program should output -1.

### 3.3 Sample I/O

### Input

```text
20 4
1 2 5 10
```

### Output

```text
5
```

### Explanation

The output is 5 because you need to carry a minimum of 5 "Essence Crystals" to be able to form any value from 1 to 20. A valid combination that achieves this minimum is:

- One crystal with value 1

- Two crystals with value 2

- One crystal with value 5

- One crystal with value 10

Total crystals carried: 1 + 2 + 1 + 1 = 5. With this set of crystals {1, 2, 2, 5, 10}, you can create every value from 1 (using just the 1) all the way up to 20 (using all of them: 1 + 2 + 2 + 5 + 10 = 20). (e.g., 1 + 2 + 10 = 13)

### Hints

- If crystals with value 1 are not provided, is it possible to form any value?

- If crystals with value 1 are the only one provided, how many crystals you would like to bring?

- Please don’t worry about the test data. We design multiple cases for different algorithms to make sure you can get the score you deserve. Just try your best to optimize your code.

### 3.4 Data Range

For at least 30% of the data, N ≤5, X ≤100. For at least 70% of the data, N ≤10, X ≤1000. For some data, there are some special cases to test the robustness of your algorithm.

