# 2025 VIP Track Problem

> Original problem statement in English.

---

## Objective

Your objective is to write a program that generates an audio playback sequence with a duration of T minutes, maximizing the total sleep integral produced by this sequence in terms of mathematical expectation. The program needs to automatically calculate the optimal action path based on the input state transition matrix and reward function. You may choose to use C, C++ or Python to complete the challenge.

## Mathematical Model

### 3.1 Table of Notations

The following symbols are used throughout the model definition:

| Symbol | Definition |
| --- | --- |
| $T$ | Total duration of the sleep session (minutes) |
| $N$ | Number of discrete sleep states (e.g., Awake, Deep Sleep) |
| $M$ | Number of available soundscapes (actions) |
| $S_t$ | The state of the brain at minute t (Sₜ ∈ [S₀, …, S_{N−1}]) |
| $a_t$ | The action selected at minute t (aₜ ∈ [a₀, …, a_{M−1}]) |
| $L$ | The wandering cycle period for the time-variant reward system |
| $\mu$ | The system’s average reward centroid |
| $R_{initial}(s)$ | The initial base reward input for state s |
| $R(s,t)$ | The calculated reward obtained for being in state s at time t |
| $P^{(a)}_{i,j}$ | Probability of moving from state i to j under action a |
| $C_{i,j}$ | Cost penalty when switching actions while moving from state i to j |
| $\mathbb I(\cdot)$ | The indicator function, which equals 1 if the condition is true, and 0 otherwise |

### 3.2 States

The brain has N discrete states. Example with N = 5:

- S0: Awake

- S1: Light Sleep

- S2: Deep Sleep

- S3: REM

- S4: Waked Up

### 3.3 Actions

The system supports M types of soundscapes (sound effects), e.g., A0 (silence), A1 (white noise), A2 (thunderstorm sound).

### 3.4 Dynamics

### 3.4.1 Transition Matrix

For each action a ∈[a0, . . . , aM−1], there is an N×N matrix P (a). P (a)

i,j represents the probability of transitioning to state j in the next minute when the current state is i and sound effect a is playing.

### 3.4.2 Generalized Cognitive Switching Penalty

To model the biological cost of changing neural states, the switching penalty is defined by a Cost Matrix CN×N. Let Ci,j be the cost of switching soundscapes (at̸ = at−1) when the brain transitions from State i to State j.

The penalty at time t is calculated as:

$$
Penalty_t=\mathbb I(a_t\ne a_{t-1})C_{S_{t-1},S_t}\tag{3.1}
$$

For t = 1, assume at−1 = a0 = 0. Noted that in basic cases, this matrix simplifies to a uniform structure where all off-diagonal costs equal a constant 0. For example, Ci,j = 0 for all i̸ = j.

### 3.4.3 Time-Variant Reward System (Value Wandering)

Rewards follow a Mean-Reverting Process. They follow a Mean-Reverting Process with an invariant centroid, preventing the brain from "locking" into a single state. As time progresses, high-value states naturally drift towards the system average, while low-value states recover, periodically inverting their relative advantages. The reward for state s at time t is calculated as:

$$
R(s,t)=\mu+(R_{initial}(s)-\mu)\cos\left(\frac{2\pi t}{L}\right)\tag{3.2}
$$

Where:

- μ: The system’s average reward centroid

$$
\mu=\frac{1}{N}\sum_{i=0}^{N-1}R_{initial}(s_i)
$$

- L: The wandering cycle period. If L = 0, rewards remain static: R(s, t) = Rinitial(s).

- Rinitial(s): The base reward input for state s.

Noted that if L = 0 in the input, the rewards remain static (R(s, t) = Rinitial(s)).

### 3.4.4 Initial Condition

The system is in State 0 (S0) at time t = 0 with a probability of 1.0.

- P(S0 = 0) = 1.0

- P(S0 = k) = 0 for all k̸ = 0

### 3.4.5 Calculation Implications

- First Transition: The probability distribution of the state at t = 1 (S1) depends entirely on the transition row for State 0 in the matrix of the chosen action a1:

$$
P(S_1=j)=P^{(a_1)}_{0,j}\tag{3.3}
$$

- First Penalty: For t = 1, the penalty calculation uses S0 = 0.

$$
Penalty_1=\mathbb I(a_1\ne0)C_{0,S_1}\tag{3.4}
$$

### 3.5 Optimization Objective

Objective Function:

Let A = [a1, a2, . . . , aT ] be the sequence of actions chosen for each minute t.

The total expected score J(A) is defined as:

$$
J(A)=\mathbb E\left[\sum_{t=1}^{T}(R(S_t,t)-Penalty_t)\right]\tag{3.5}
$$

Where :

- St is the random variable representing the sleep state at time t.

- I(·) is the indicator function (1 if switching occurs, 0 otherwise).

- E[·] is the expectation taken over the stochastic transitions defined by matrices P(at).

Optimization Problem:

Find the optimal sequence A∗such that:

$$
A^*=\operatorname*{argmax}_{a_1,\ldots,a_T}J(A)\tag{3.6}
$$

## Input & Output

All data is read through standard input (stdin).

### 4.1 Input Format

The input consists of the following structure:

```text
T N M L Type
R0 R1 ... RN-1
[Switching Penalty Matrix]
[Matrix block Action 0]
[Matrix block Action 1]
...
[Matrix block Action M-1]
```

Line 1: Four integers

- T: Total duration (minutes).

- N: Number of states.

- M: Number of sound effects.

- L: Cycle period for reward wandering. If L = 0, R(s, t) = Rinitial(s).

- Type: Constraint mode identifier.

Line 2: Base Rewards

- N integers representing the initial base rewards Rinitial(s).

Switching Penalty Matrix

An N × N integer matrix block always follows, regardless of the Type value.

- If Type = 1 (Generalized Matrix Penalty Mode): The value at row i, column j represents the specific switching penalty Ci,j.

- If Type = 0 (Uniform Penalty Mode): The matrix block is still provided to maintain input format consistency, but all values in this matrix will be 0. Your program should ignore the values in this matrix and assume the penalty is 0 (Static K = 0).

Matrix Blocks

The following M blocks each represent a transition matrix for a sound effect. Each block contains N rows, with N floating-point numbers (0.0 to 1.0) per row. The number in the i-th row and j-th column represents P(Statei →Statej). The sum of each row is guaranteed to be 1.0.

### 4.2 Output Format

Output a single line containing the sequence of sound effect IDs formatted as a JSON-style list:

[a1, a2, . . . , aT ]

Each integer represents the sound effect ID selected for this minute (from 0 to M −1). Separators must strictly be a comma followed by a space.

Example Input:

For input examples, please refer to the Appendix Raw Input.txt.

Example Output:

```text
[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0]
```

## Rubrics

### 5.1 Scoring Mechanism: God’s-eye View and Time Penalty

The competition consists of 10 test cases. The total score is calculated using the following formulas:

$$
Score^i_{base}=\min(Score^i_{raw},Score^i_{standard})\tag{5.1}
$$

$$
Score^i_{bonus}=\max(0,Score^i_{raw}-Score^i_{standard})\frac{1}{1+\log(1+T^i_{use})}\tag{5.2}
$$

$$
Score_{final}=\sum_{i=1}^{10}(Score^i_{base}+Score^i_{bonus})\tag{5.3}
$$

Where:

- Scorei raw: The expected value calculated by the evaluation system using precise matrix multiplication based on your output sequence.

- Scorei standard: The qualification target score officially set by the Competition Committee.

- Scorei base: Capped at the standard score.

- Scorei bonus: Awarded only if the raw score exceeds the standard, scaled by computational efficiency.

- T i use: The algorithm’s running time on the i-th test case.

Note: Illegal output results in a score of 0.

### 5.2 Test Cases

Basic cases (30%):

- Constraints: No penalty (Type = 0)

- States Reward: Constants (L = 0)

- Size: T ≤50, M = 10, N = 5

Performance test cases (40%):

- Constraints: Switching Penalty Matrix (Type = 1)

- States Reward: Constants (L = 0)

- Size: 1000 ≤T ≤3000, M = 80, N = 40

Ultimate test cases (30%):

- Constraints: Switching Penalty Matrix (Type = 1)

- States Reward: Time-Variant Reward System (L = T)

- Size: 1000 ≤T ≤3000, M = 80, N = 40

## Example Input

```text
20 5 3 20 1
0 20 50 100 0
0 10 20 50 0
10 0 10 20 0
20 10 0 10 0
50 20 10 0 0
0 0 0 0 0
1.0 0.0 0.0 0.0 0.0
0.9 0.1 0.0 0.0 0.0
0.5 0.5 0.0 0.0 0.0
0.1 0.1 0.8 0.0 0.0
0.0 0.0 0.1 0.9 0.0
0.5 0.5 0.0 0.0 0.0
0.1 0.8 0.1 0.0 0.0
0.0 0.2 0.7 0.1 0.0
0.0 0.0 0.2 0.8 0.0
1.0 0.0 0.0 0.0 0.0
0.2 0.2 0.2 0.2 0.2
0.2 0.2 0.2 0.2 0.2
0.2 0.2 0.2 0.2 0.2
0.2 0.2 0.2 0.2 0.2
1.0 0.0 0.0 0.0 0.0
```

## Example output format

Format Specification: [a1, a2, . . . , aT ]

- The output must start with [ and end with ].

- at: An integer representing the Sound Effect ID selected for the tth minute (0 ≤at < M).

- Separator: Between any two integers, strictly use a comma followed by a space (, ). Example Output: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0]
