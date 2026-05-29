# Multiplayer Exam Game Report

## Overview

The **Multiplayer Exam Game** is a real-time, peer-to-peer collaborative quiz feature added to the Claude Developer Certification study app. It allows a **Director** to host a live exam session and **Participants** to join via a shared link, answer questions synchronously, and review results together.

---

## Architecture

- **No backend server required.**
- Uses a public MQTT broker (`broker.hivemq.com`) over secure WebSockets (`wss://broker.hivemq.com:8884/mqtt`).
- All game state is synchronized peer-to-peer via MQTT topics under the namespace `claude_cert_v1/<ROOM_ID>/broadcast`.
- The Director acts as the authoritative state manager and broadcasts state snapshots to all participants.

---

## Game Flow

### 1. Lobby
- The Director creates a room and receives a **6-character room code** (e.g., `AB12CD`).
- A shareable link is generated with `?room=<CODE>` query parameter.
- Participants open the link, enter their name, and join.
- The Director sees a live participant list and can configure:
  - Question category filter (or all categories)
  - Number of questions (1–100)

### 2. Question Phase
- Director clicks **Start Game**.
- All participants see the same question with **4 randomized answer options**.
- Participants select one answer and submit.
- The Director sees a live counter of how many participants have answered.

### 3. Reveal Phase
- When ready, the Director clicks **Reveal Answer**.
- The correct answer is highlighted in green.
- Each participant’s answer is shown with a badge:
  - ✅ **Right** — answered correctly
  - ❌ **Wrong** — answered incorrectly
- Everyone can discuss the question in the built-in chat.

### 4. Navigation
- Director clicks **Next Question** to proceed.
- At the end, **Finish Game** triggers the final scoreboard.

### 5. End Screen
- Final scores are displayed for every participant.
- Format: `Correct / Total` (e.g., `17 / 20`).
- Director can click **Play Again** to restart with the same room.

---

## Roles

| Role | Actions |
|------|---------|
| **Director** | Create room, start game, reveal answers, navigate questions, finish game |
| **Participant** | Join via link, answer questions, view reveals, chat, see final scores |

---

## Real-Time Chat

- A chat panel is visible in every phase: **Lobby**, **Question**, **Reveal**, and **End**.
- Messages are sent via MQTT and appear instantly for all connected players.
- Messages are tagged with the sender’s name and styled differently for your own messages vs. others.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Transport | MQTT over WebSocket (HiveMQ public broker) |
| Client Library | `mqtt` (unpkg CDN) |
| Frontend | Vanilla HTML, CSS, JavaScript (no build step) |
| Styling | Existing app dark-theme CSS variables |

---

## Files Changed

- `index.html` — added multiplayer tab, MQTT integration, game logic, chat, and UI components.

---

## URL Sharing

Participants can join by opening any of the following:

1. The direct link with room code:  
   `https://<host>/?room=<ROOM_CODE>`
2. Manually entering the room code on the **Multiplayer** tab.

---

## Future Enhancements

- Timer per question.
- Leaderboard with streaks and fastest answer tracking.
- Private rooms with password protection.
- Persistent room history and replay.

---

*Built for the Claude Developer Certification Exam study community.*
