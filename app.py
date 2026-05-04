"""
NegotiAI — app.py
Flask Backend · INT428 AI Essentials Project
5 AI-powered routes using Groq (free) and Gemini Flash (free)
"""

import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GROQ_API_KEY    = os.getenv("GROQ_API_KEY", "")
GEMINI_API_KEY  = os.getenv("GEMINI_API_KEY", "")

# ─────────────────────────────────────────────────────────────
# Helper: call Groq (llama-3.3-70b-versatile) — free tier
# ─────────────────────────────────────────────────────────────
def groq_chat(messages, temperature=0.7):
    import requests
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 600
    }
    resp = requests.post(url, headers=headers, json=payload, timeout=20)
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"].strip()


# ─────────────────────────────────────────────────────────────
# Helper: call Gemini 1.5 Flash — free tier
# ─────────────────────────────────────────────────────────────
def gemini_generate(prompt):
    import requests
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.6, "maxOutputTokens": 500}
    }
    resp = requests.post(url, json=payload, timeout=20)
    resp.raise_for_status()
    return resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()


# ═══════════════════════════════════════════════════════════
# FEATURE 1 — AI Negotiation Chatbot
# Unit IV + V: NLP, Chatbots, Role-based + CoT Prompting
# POST /api/negotiate
# ═══════════════════════════════════════════════════════════
@app.route("/api/negotiate", methods=["POST"])
def negotiate():
    try:
        data        = request.get_json()
        product     = data.get("product", "")
        curr_price  = data.get("curr_price", 0)
        target      = data.get("target_price", 0)
        history     = data.get("history", [])   # [{role, content}]

        system_prompt = f"""You are NegotiAI, an expert AI price negotiation agent.
Your job is to argue firmly on the buyer's behalf and negotiate the best deal.

Chain-of-thought process you MUST follow every reply:
1. Think: what is the product's market position and competitor pricing?
2. Think: what negotiation tactics apply (competitor price, product age, bundle, urgency)?
3. Think: what is a realistic counter-offer given the target?
4. Then craft a short, persuasive negotiation message.

Product: {product}
Current listed price: ₹{curr_price:,}
Buyer's target price: ₹{target:,}

Role rules:
- You play TWO roles in ONE reply: briefly show your reasoning as [NegotiAI thinking…] then give the actual [Message to Seller].
- Be specific, cite numbers, be confident but polite.
- If the deal is close to target, suggest accepting or locking it.
- Keep the total reply under 120 words."""

        messages = [{"role": "system", "content": system_prompt}]
        messages += history

        reply = groq_chat(messages)
        return jsonify({"reply": reply, "ok": True})

    except Exception as e:
        return jsonify({
            "reply": "NegotiAI is analyzing the market… (API temporarily unavailable). "
                     "Try: mention a competitor's lower price and ask for a price match.",
            "ok": False,
            "error": str(e)
        }), 200


# ═══════════════════════════════════════════════════════════
# FEATURE 2 — Prompt Engineering Showcase
# Unit V: Zero-shot, Few-shot, Chain-of-Thought
# POST /api/prompt-demo
# ═══════════════════════════════════════════════════════════
@app.route("/api/prompt-demo", methods=["POST"])
def prompt_demo():
    try:
        data      = request.get_json()
        product   = data.get("product", "iPhone 15 Pro")
        technique = data.get("technique", "zero-shot")   # zero-shot | few-shot | cot

        if technique == "zero-shot":
            prompt_text = f"Should I buy {product} now or wait for a better price?"
            messages = [
                {"role": "user", "content": prompt_text}
            ]

        elif technique == "few-shot":
            prompt_text = (
                "Q: Should I buy Sony WH-1000XM5 now or wait?\n"
                "A: Wait. A newer model (XM6) just launched, pushing XM5 prices down 15–20%. "
                "Prices should drop below ₹22,000 in 4–6 weeks.\n\n"
                "Q: Should I buy Samsung S23 FE now or wait?\n"
                "A: Buy now. S23 FE is at its lowest ever. S25 FE won't launch for 8+ months "
                "and prices won't fall further — current ₹34,999 is a strong deal.\n\n"
                f"Q: Should I buy {product} now or wait for a better price?\n"
                "A:"
            )
            messages = [
                {"role": "user", "content": prompt_text}
            ]

        else:  # chain-of-thought
            prompt_text = (
                f"Should I buy {product} now or wait for a better price?\n\n"
                "Think step by step:\n"
                "Step 1: What is the current price trend for this product?\n"
                "Step 2: Are there any upcoming sale events or new model launches?\n"
                "Step 3: What does historical pricing data suggest?\n"
                "Step 4: Based on steps 1–3, give a final buy/wait recommendation with reasoning.\n\n"
                "Answer:"
            )
            messages = [
                {"role": "user", "content": prompt_text}
            ]

        reply = groq_chat(messages, temperature=0.5)
        return jsonify({
            "reply": reply,
            "prompt_sent": prompt_text,
            "technique": technique,
            "ok": True
        })

    except Exception as e:
        return jsonify({
            "reply": "API temporarily unavailable. The prompt engineering demo shows how different prompting styles produce different depth of reasoning.",
            "prompt_sent": "",
            "ok": False,
            "error": str(e)
        }), 200


# ═══════════════════════════════════════════════════════════
# FEATURE 3 — Natural Language AI Product Search
# Unit IV: NLP, Language Models, Intent Matching
# POST /api/nl-search
# ═══════════════════════════════════════════════════════════
@app.route("/api/nl-search", methods=["POST"])
def nl_search():
    try:
        data    = request.get_json()
        query   = data.get("query", "")
        products = data.get("products", [])

        product_list_str = "\n".join([
            f"ID:{p['id']} | {p['name']} | ₹{p['curr']} | Cat:{p['cat']} | Platform:{p['platform']} | Tags:{','.join(p.get('tags', []))}"
            for p in products
        ])

        prompt = f"""You are a smart product search AI. Match the user's natural language query to the most relevant products.

User query: "{query}"

Product list:
{product_list_str}

Return a JSON array (and nothing else — no markdown, no explanation) of up to 5 best matches in this format:
[
  {{"id": "p1", "reason": "one sentence why this matches"}},
  {{"id": "p3", "reason": "one sentence why this matches"}}
]

Only return valid JSON. Rank by relevance to the query. Do not include products that don't match."""

        result_text = gemini_generate(prompt)

        # strip markdown code fences if present
        cleaned = result_text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
        cleaned = cleaned.strip()

        matches = json.loads(cleaned)
        return jsonify({"matches": matches, "ok": True})

    except Exception as e:
        return jsonify({
            "matches": [],
            "ok": False,
            "error": str(e)
        }), 200


# ═══════════════════════════════════════════════════════════
# FEATURE 4 — AI Price Insight
# Unit VI: Data Analysis with AI Tools
# POST /api/price-insight
# ═══════════════════════════════════════════════════════════
@app.route("/api/price-insight", methods=["POST"])
def price_insight():
    try:
        data        = request.get_json()
        product     = data.get("product", "")
        data_points = data.get("data_points", [])   # [{month, price}]

        dp_str = ", ".join([
            f"{d['month']}: ₹{d['price']:,}" for d in data_points if d.get("price")
        ])

        prompt = f"""Analyze this 12-month price data for {product}:
{dp_str}

Reply with EXACTLY two sentences separated by a newline:
Sentence 1: Describe the trend pattern (rising/falling/stable, percentage, speed).
Sentence 2: Give a specific buy now or wait recommendation with a reason.

Do not add any other text, labels, or formatting."""

        insight = gemini_generate(prompt)
        sentences = [s.strip() for s in insight.strip().split("\n") if s.strip()]
        trend_sentence = sentences[0] if len(sentences) > 0 else insight
        rec_sentence   = sentences[1] if len(sentences) > 1 else ""

        return jsonify({
            "trend": trend_sentence,
            "recommendation": rec_sentence,
            "ok": True
        })

    except Exception as e:
        return jsonify({
            "trend": "Price data shows a consistent downward movement over the tracked period.",
            "recommendation": "Consider buying within the next 2 weeks for the best deal.",
            "ok": False,
            "error": str(e)
        }), 200


# ═══════════════════════════════════════════════════════════
# FEATURE 5 — Price Drop Probability
# Unit III: ML Concepts, Feature Engineering (rule-based scoring)
# POST /api/drop-probability
# ═══════════════════════════════════════════════════════════
@app.route("/api/drop-probability", methods=["POST"])
def drop_probability():
    try:
        data = request.get_json()
        products = data.get("products", [])
        results  = []

        # Upcoming major Indian sale dates (hardcoded — INT428 Unit III feature)
        today = datetime.now()
        year  = today.year
        sale_dates = [
            datetime(year,  4, 14),  # Flipkart Summer Sale
            datetime(year,  7, 15),  # Amazon Prime Day
            datetime(year,  8, 15),  # Independence Day Sale
            datetime(year, 10,  2),  # Big Billion Days
            datetime(year, 10, 20),  # Diwali Sale
            datetime(year, 11, 11),  # Singles Day
            datetime(year, 12, 15),  # Year-End Sale
            # next year
            datetime(year+1, 1, 26), # Republic Day Sale
            datetime(year+1, 4, 14),
        ]
        future_sales = [s for s in sale_dates if s >= today]
        min_days_to_sale = min(abs((s - today).days) for s in future_sales) if future_sales else 90

        for p in products:
            score = 0

            # ── Feature 1: Days since last price drop (weight: 25 pts) ──
            # Use trend as proxy — falling products had recent drop
            trend = p.get("trend", "stable")
            if trend == "down":
                days_since_drop = 15
            elif trend == "stable":
                days_since_drop = 45
            else:  # up
                days_since_drop = 10

            score += min(25, int((days_since_drop / 90) * 25))

            # ── Feature 2: Discount depth (weight: 30 pts) ──
            orig = p.get("orig", 1)
            curr = p.get("curr", 1)
            discount_pct = ((orig - curr) / orig * 100) if orig > 0 else 0

            if discount_pct < 5:
                score += 30      # barely discounted — big room left
            elif discount_pct < 12:
                score += 22
            elif discount_pct < 22:
                score += 14
            elif discount_pct < 35:
                score += 8
            else:
                score += 3       # already heavily discounted

            # ── Feature 3: Sale season proximity (weight: 25 pts) ──
            if min_days_to_sale <= 7:
                score += 25
            elif min_days_to_sale <= 14:
                score += 20
            elif min_days_to_sale <= 30:
                score += 15
            elif min_days_to_sale <= 60:
                score += 8
            else:
                score += 2

            # ── Feature 4: Platform competitiveness (weight: 20 pts) ──
            platform = p.get("platform", "").lower()
            if "amazon" in platform:
                score += 20
            elif "flipkart" in platform:
                score += 18
            elif "croma" in platform:
                score += 10
            elif "myntra" in platform or "ajio" in platform:
                score += 12
            else:
                score += 6

            score = min(100, max(0, score))

            if score < 30:
                label = "Low"
            elif score < 55:
                label = "Moderate"
            elif score < 75:
                label = "High"
            else:
                label = "Very High"

            results.append({
                "id":    p.get("id"),
                "score": score,
                "label": label
            })

        return jsonify({"results": results, "ok": True})

    except Exception as e:
        return jsonify({"results": [], "ok": False, "error": str(e)}), 200


# ═══════════════════════════════════════════════════════════
if __name__ == "__main__":
    app.run(debug=True, port=5000)

@app.route("/")
def home():
    return "Backend is running!"