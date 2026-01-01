const btn = document.getElementById("sendBtn");
const postBtn = document.getElementById("sendPostBtn");
const input = document.getElementById("nameInput");
const greeting = document.getElementById("greeting");

// GET 请求
btn.addEventListener("click", () => {
    const name = input.value.trim();
    if (!name) return alert("请输入名字");

    fetch(`/api/greet?name=${encodeURIComponent(name)}`)
        .then(res => res.json())
        .then(data => {
            greeting.textContent = data.message;
        })
        .catch(err => {
            console.error(err);
            greeting.textContent = "请求失败";
        });
});

// POST 请求
postBtn.addEventListener("click", () => {
    const name = input.value.trim();
    if (!name) return alert("请输入名字");

    fetch(`/api/greet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    })
    .then(res => res.json())
    .then(data => {
        greeting.textContent = data.message;
    })
    .catch(err => {
        console.error(err);
        greeting.textContent = "请求失败";
    });
});
