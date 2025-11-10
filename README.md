
# 🐠 Guppy Shoaling Resilience: FSO Predictive Simulator

## A MERN-Based Computational Model for Collective Behaviour Under Environmental Stress

This project delivers a full-stack MERN (MongoDB, Express, React, Node.js) application that transforms the **Fish Swarm Optimization (FSO)** algorithm into a predictive simulator for quantifying the breakdown of collective intelligence—specifically guppy (Poecilia reticulata) shoaling behavior—under controlled environmental stress.

---

## 🎯 Problem Description

Traditional ethological studies often struggle to isolate how specific environmental factors affect the highly complex and non-linear dynamics of collective animal behavior. Observation alone provides limited, correlative data on shoaling breakdown.

This simulator addresses the difficulty in systematically observing and quantifying the degradation of shoaling cohesion when individual parameters are stressed:

| Environmental Stressor | Range | Implication |
| :--- | :--- | :--- |
| **Dissolved Oxygen (DO)** | Optimal $\rightarrow$ Hypoxic | Lethargy, reduced communication. |
| **Feed Quality** | High $\rightarrow$ Low | Increased urgency, stress-induced feeding behavior. |
| **Impurity Levels (e.g., Ammonia)** | Trace $\rightarrow$ High | Physiological distress, erratic movement. |
| **Light Intensity** | Optimal $\rightarrow$ Extreme | Anxiety, avoidance behavior. |

By translating these inputs into a single **Effective Stress Factor ($\mathcal{S}$)**, the model dynamically alters the underlying FSO parameters to visualize and measure the resulting degradation.

---

## 💡 Solution: The FSO Predictive Simulator

The simulator models individual guppies as computational "agents" following the rules of FSO (Prey, Follow, Swarm behaviors).

### 🖥️ Core Features

#### 1. Interactive Stress Translation (React Frontend)

The user interface, built with React, provides intuitive sliders for manipulating the four environmental parameters.

* **Dynamic Mapping:** These inputs are mapped via a proprietary weighting function to generate the Effective Stress Factor ($\mathcal{S}$).
* **Real-time Visualization:** The frontend renders a 2D or 3D view of the fish agents, showing the immediate visual effect of the stress factor on the shoal's formation and movement.

#### 2. Quantifiable Output (Node.js/FSO Backend)

The core FSO logic runs on the Express backend, calculating two primary, quantifiable metrics:

| Metric | Description | Optimal State (Normal) | Degraded State (Stressed) |
| :--- | :--- | :--- | :--- |
| **Cohesion** | The average stability and tightness of the shoal (mean distance to the center of mass). | High, stable average. | Low, high variance (dispersal). |
| **Convergence Efficiency** | The effectiveness and speed of the shoal in locating a designated resource (e.g., food source or optimal DO zone). | Fast, direct path to target. | Slow, meandering, inefficient search. |

#### 3. Data Persistence & Analytics (MongoDB)

All simulation runs, input parameters, and time-series metric logs are stored securely in MongoDB.

* **Session Storage:** Enables users to save, review, and compare simulation results.
* **ML Dataset Generation:** Provides a persistent, labeled dataset for future machine learning models aimed at predicting collective resilience thresholds.

---

## 🛠️ Tech Stack

* **Frontend:** **React** (with Tailwind CSS for aesthetics)
* **Visualization:** (Placeholder - e.g., p5.js or Three.js) for rendering the swarm
* **Backend:** **Node.js / Express.js** (Hosting the FSO simulation logic)
* **Database:** **MongoDB** (Persistent storage of session data and simulation metrics)

---

## 🧾 References

This project is grounded in established computational and ethological research:

  * Firebug Swarm Optimization Algorithm (ScienceDirect)
  * Artificial Fish Swarm Algorithm Applied to Engineering Design (Elsevier)
  * Fish Swarm Optimization Algorithm Overview (ResearchGate)
  * Fluctuating Asymmetry as a Stress Indicator (ResearchGate)

-----
