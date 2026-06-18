const Base_url = "https://biyovo1194.pythonanywhere.com/api/v1/tasks/";

export async function fetchTodos() {
    try {
        var javob = await fetch(Base_url);
        if (javob.ok == false) return [];
        var olinganData = await javob.json();
        if (olinganData.data && olinganData.data.results) {
            return olinganData.data.results;
        } else if (olinganData.results) {
            return olinganData.results;
        } else {
            return olinganData;
        }
    } catch (xato) {
        console.log(xato);
        return [];
    }
}

export async function postTodo(title, description) {
    try {
        var javob = await fetch(Base_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title, description: description, completed: false })
        });
        return javob.ok;
    } catch (xato) {
        console.log(xato);
        return false;
    }
}

export async function patchTodoStatus(id, hozirgiHolat) {
    try {
        var javob = await fetch(Base_url + id + "/", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !hozirgiHolat })
        });
        return javob.ok;
    } catch (xato) {
        console.log(xato);
        return false;
    }
}

export async function putTodo(id, yangiTitle, yangiDesc, holat) {
    try {
        var javob = await fetch(Base_url + id + "/", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: yangiTitle, description: yangiDesc, completed: holat })
        });
        return javob.ok;
    } catch (xato) {
        console.log(xato);
        return false;
    }
}

export async function removeTodo(id) {
    try {
        var javob = await fetch(Base_url + id + "/", { method: "DELETE" });
        return javob.ok;
    } catch (xato) {
        console.log(xato);
        return false;
    }
}