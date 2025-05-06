console.log("fail ühendatud");

class Entry {
    constructor(title, description, date, priority) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.done = false;
    }
}

class Todo {
    constructor(){
        this.entries = JSON.parse(localStorage.getItem("entries")) || [];
        this.render();
        document.querySelector("#addButton").addEventListener("click", () => this.addEntry());
    }

    addEntry() {
        const titleValue = document.querySelector("#title").value;
        const descriptionValue = document.querySelector("#description").value;
        const dateValue = document.querySelector("#date").value;
        const priorityValue = document.querySelector("#priority").value;

        if (!titleValue || !dateValue) {
            alert("Palun sisesta vähemalt pealkiri ja tähtaeg!");
            return;
        }

        this.entries.push(new Entry(titleValue, descriptionValue, dateValue, priorityValue));
        this.save();
    }

    editEntry(index) {
        const entry = this.entries[index];
        const title = prompt("Muuda pealkiri:", entry.title);
        const description = prompt("Muuda kirjeldus:", entry.description);
        const date = prompt("Muuda tähtaeg (YYYY-MM-DD):", entry.date);
        const priority = prompt("Muuda prioriteet (Kõrge, Keskmine, Madal):", entry.priority);

        if (title && date && priority) {
            entry.title = title;
            entry.description = description;
            entry.date = date;
            entry.priority = priority;
            this.save();
        }
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    render() {
        let tasklist = document.querySelector("#taskList");
        tasklist.innerHTML = "";

        const ul = document.createElement("ul");
        const doneUl = document.createElement("ul");
        ul.className = "todo-list";
        doneUl.className = "todo-list";
        const taskHeading = document.createElement("h2");
        const doneHeading = document.createElement("h2");
        taskHeading.innerText = "Todo";
        doneHeading.innerText = "Done tasks";

        // Sorteeri tähtaja järgi
        this.entries.sort((a, b) => new Date(a.date) - new Date(b.date));

        this.entries.forEach((entry, index) => {
            const li = document.createElement("li");
            const div = document.createElement("div");
            const buttonDiv = document.createElement("div");
            buttonDiv.className = "button-container";

            const deleteButton = document.createElement("button");
            const doneButton = document.createElement("button");
            const editButton = document.createElement("button");

            doneButton.innerText = "✔";
            editButton.innerText = "EDIT";
            deleteButton.innerText = "X";
            deleteButton.className = "delete";
            doneButton.className = "done";
            editButton.className = "edit";

            deleteButton.addEventListener("click", () => {
                this.entries.splice(index, 1);
                this.save();
            });

            doneButton.addEventListener("click", () => {
                this.entries[index].done = !this.entries[index].done;
                this.save();
            });

            editButton.addEventListener("click", () => this.editEntry(index));

            div.className = "task";
            div.setAttribute("data-priority", entry.priority);

            div.innerHTML = `
                <div><strong>${entry.title}</strong> (${entry.priority})</div>
                <div>${entry.description}</div>
                <div>Tähtaeg: ${this.formatDate(entry.date)}</div>
            `;

            if (entry.done) {
                doneButton.classList.add("done-task");
                doneUl.appendChild(li);
            } else {
                ul.appendChild(li);
            }

            li.appendChild(div);
            li.appendChild(buttonDiv);
            buttonDiv.appendChild(deleteButton);
            buttonDiv.appendChild(doneButton);
            buttonDiv.appendChild(editButton);
        });

        tasklist.appendChild(taskHeading);
        tasklist.appendChild(ul);
        tasklist.appendChild(doneHeading);
        tasklist.appendChild(doneUl);
    }

    save() {
        localStorage.setItem("entries", JSON.stringify(this.entries));
        this.render();
    }
}

const todo = new Todo();
