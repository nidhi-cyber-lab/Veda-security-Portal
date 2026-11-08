from flask import Flask, send_from_directory, request, jsonify
import os
import sqlite3

app = Flask(__name__)

PROJECT_FOLDER = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

DB_PATH = os.path.join(os.path.dirname(__file__), "veda.db")


# Create database tables
def create_database():
    conn = sqlite3.connect(DB_PATH)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS risks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            likelihood INTEGER,
            impact INTEGER,
            score INTEGER,
            level TEXT
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS incidents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            type TEXT,
            severity TEXT,
            description TEXT
        )
    """)

    conn.commit()
    conn.close()


@app.route("/")
def home():
    return send_from_directory(PROJECT_FOLDER, "index.html")


@app.route("/style.css")
def css():
    return send_from_directory(PROJECT_FOLDER, "style.css")


@app.route("/script.js")
def javascript():
    return send_from_directory(PROJECT_FOLDER, "script.js")


@app.route("/assets/<path:filename>")
def assets(filename):
    return send_from_directory(
        os.path.join(PROJECT_FOLDER, "assets"), filename
    )


@app.route("/api/status")
def status():
    return jsonify({
        "project": "Veda Security Portal",
        "status": "Active",
        "message": "Backend connected successfully"
    })


@app.route("/api/risks", methods=["GET", "POST"])
def risks():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    if request.method == "POST":
        data = request.get_json()

        conn.execute("""
            INSERT INTO risks (name, likelihood, impact, score, level)
            VALUES (?, ?, ?, ?, ?)
        """, (
            data["name"],
            data["likelihood"],
            data["impact"],
            data["score"],
            data["level"]
        ))

        conn.commit()
        conn.close()
        return jsonify({"message": "Risk saved successfully"})

    records = conn.execute("SELECT * FROM risks").fetchall()
    conn.close()

    return jsonify([dict(record) for record in records])


@app.route("/api/incidents", methods=["GET", "POST"])
def incidents():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    if request.method == "POST":
        data = request.get_json()

        conn.execute("""
            INSERT INTO incidents (title, type, severity, description)
            VALUES (?, ?, ?, ?)
        """, (
            data["title"],
            data["type"],
            data["severity"],
            data["description"]
        ))

        conn.commit()
        conn.close()
        return jsonify({"message": "Incident saved successfully"})

    records = conn.execute("SELECT * FROM incidents").fetchall()
    conn.close()

    return jsonify([dict(record) for record in records])


create_database()

if __name__ == "__main__":
    app.run(debug=True)