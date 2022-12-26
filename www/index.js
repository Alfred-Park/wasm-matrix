import { Matrix } from "wasm-matrix";
import { memory } from "wasm-matrix/wasm_matrix_bg.wasm";

const set_matrix = () => {
    const tb_a = document.querySelector("#mat-a tbody");
    const tb_b = document.querySelector("#mat-b tbody");
    const tb_c = document.querySelector("#mat-c tbody");

    const di = parseInt(document.querySelector("#di").value);
    const dk = parseInt(document.querySelector("#dk").value);
    const dj = parseInt(document.querySelector("#dj").value);

    tb_a.innerHTML = "";
    tb_b.innerHTML = "";
    tb_c.innerHTML = "";

    for (let i = 0; i < di; i++) {
        const tr = document.createElement("tr");
        for (let k = 0; k < dk; k++) {
            const td = document.createElement("td");
            td.innerHTML = `<input class="mat-inp" type="number" value="0" />`;
            tr.appendChild(td);
        }
        tb_a.appendChild(tr);
    }

    for (let k = 0; k < dk; k++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < dj; j++) {
            const td = document.createElement("td");
            td.innerHTML = `<input class="mat-inp" type="number" value="0" />`;
            tr.appendChild(td);
        }
        tb_b.appendChild(tr);
    }

    for (let i = 0; i < di; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < dj; j++) {
            const td = document.createElement("td");
            td.setAttribute("id", `c${i}-${j}`);
            td.innerHTML = "0";
            tr.appendChild(td);
        }
        tb_c.appendChild(tr);
    }
};

const calc_matrix = (mat) => {
    const tb_a = document.querySelector("#mat-a tbody");
    const tb_b = document.querySelector("#mat-b tbody");
    const tb_c = document.querySelector("#mat-c tbody");

    const di = parseInt(document.querySelector("#di").value);
    const dk = parseInt(document.querySelector("#dk").value);
    const dj = parseInt(document.querySelector("#dj").value);

    if (di < 0 || dk < 0 || dj < 0 || di > 32 || dk > 32 || dj > 32) return;

    const a = Array.from(tb_a.querySelectorAll("td input")).map(e => {
        const res = parseFloat(e.value);
        return res ? res : 0.0;
    });

    const b = Array.from(tb_b.querySelectorAll("td input")).map(e => {
        const res = parseFloat(e.value);
        return res ? res : 0.0;
    });

    mat.dot(a, b, di, dk, dj);

    const c = new Float64Array(memory.buffer, mat.get_result_ptr(), di * dj);
    tb_c.querySelectorAll("td").forEach((e, i) => e.innerHTML = c[i]);
};

const main = () => {
    const matrix = Matrix.new();

    set_matrix();
    calc_matrix(matrix);

    addEventListener("change", e => {
        if (e.target.classList.contains("config")) {
            set_matrix();
        } else {
            calc_matrix(matrix);
        }
    }, false);
};

main();
