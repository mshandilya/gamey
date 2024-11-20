# GameY

Welcome to **GameY**, a web-based implementation of the classic **Game of Y**, a strategic connection game played on a triangular board. The objective is to form a continuous path connecting all three sides of the triangle. You can play against a friend or challenge AIs with strategic algorithms. Test your skills, sharpen your tactics, and enjoy this engaging board game experience.

**Live Demo:** [gamey](https://mshandilya.github.io/gamey)

---

## Features

- **Play Modes**  
  - Multiplayer: Play with a friend.  
  - AI Opponent: Challenge AIs powered by:
    - **Minimax with Alpha-Beta Pruning**: An exhaustive search strategy to make optimal decisions.
    - **Markov Decision Processes (MDP)**: A probabilistic model for decision-making.
    - **All Moves As First (AMAF)**: A heuristic approach that treats all moves as first.

- **Intuitive Interface**: Simple and interactive board design for smooth gameplay. 
- **Customizable Gameplay**: Choose between human and AI opponents.

---

## Screenshots

![Home Screen](https://github.com/user-attachments/assets/c62f81a7-8259-4e74-9e9c-f1d835d13bf8)

![Gameplay](https://github.com/user-attachments/assets/7ca814fe-212d-413a-aff9-b8f755a9cbd8)

---

## Getting Started

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mshandilya/gamey.git
   cd gamey
   ```

2. **Serve locally**  
   Open `index.html` in any modern browser, or use a local server like Python's `http.server`:  
   ```bash
   python -m http.server
   ```

3. Open `http://localhost:8000` in your browser to start playing.

---

## Feedback and Contributions

We welcome your feedback and contributions to make **GameY** even better.  

- **Report Issues:** Use the [GitHub Issues](https://github.com/mshandilya/gamey/issues) page for bugs or feature requests.  
- **Contribute:** Fork the repository and submit a pull request with your changes.
