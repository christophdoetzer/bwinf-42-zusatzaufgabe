<script>
    import SensorField from "$lib/sensorField.svelte";
    import SelectingButton from "$lib/selectingButton.svelte";
    import { field } from "../store";
    import { potentialSources } from "../store";
    import { finalLights } from "../store";
    import { previewPlacement } from "../store";
    import { soundEffects } from "../store";
    import { wayOfLights } from "../store";
    import { preview } from "../store";
    import { wayOfLightArr } from "../store";
    import { deletingButtons } from "../store";
    import { onMount } from "svelte";

    $wayOfLightArr = [[], [], [], [], [], [], [], []];
    $preview = [[], []];
    $deletingButtons = [[], [], [], [], [], [], [], []];

    let gridRows = "52px 52px 52px 52px 52px 52px 52px 52px";
    let gridColm = "52px 52px 52px 52px 52px 52px 52px 52px";
    let height = 8;
    let width = 8;
    let oldWidth = width;
    let rendered = false;
    let renderSettings = true;
    let isBig = true;
    onMount(() => {
        isBig = !window.matchMedia("(max-width: 1000px)").matches;
        if (!isBig) {
            renderSettings = false;
        }
    });
    function handleHelp() {
        let helpMessage = `                              -- Wilkommen zur --
             -- Simulation elektrischer Bausteine --

Aufgabenstellung:
https://bwinf.de/fileadmin/bundeswettbewerb/42/BwInf_42_Aufgaben_WEB.pdf

Anleitung:
- Durch Anklicken werden die Sensoren ausgewählt
- Anschließend können diese frei auf dem Feld plaziert werden
      - Die Quellen (linker Baustein) nur links plazieren
      - Die Sensoren (mittlere Bausteine)  nur in der Mitte plaziert
      - Die Abschlusssensoren (rechter Baustein) nur rechts plaziert
- Über das Kreuz können die Bausteine wieder gelöscht werden
- In den Einstellungen können weitere Details der Simulation ausprobiert werden

Funktionen der Bausteine:
- Die Lampen (linker Baustein) geben das erste Licht
- Die Roten leuchten immer außer der eine Sensor ist beleuchtet
- Die Weißen leuchten immer außer beide Sensoren sind beleuchtet
- Die Blauen leiten das Licht einfach weiter, wie ihre Sensoren es aufnahmen

Bei weiteren Fragen/Rückmeldungen:
- Schreiben Sie mir gerne eine Email an: christoph1234@posteo.de

Hinweis:
Diese Website wurde primär für den Desktop entwickelt, weshalb die Nutzung auf mobilen Endgeräten teils nur beschränkt möglich ist.

Credits:
- https://icon-sets.iconify.design/material-symbols/help-outline/
- https://icon-sets.iconify.design/ic/round-refresh/
- https://icon-sets.iconify.design/carbon/close-filled/
- https://icon-sets.iconify.design/solar/heart-linear/
`;
        alert(helpMessage);
    }

    function handleClear() {
        let newField = [];
        for (let i = 0; i < height; i++) {
            let row = [];
            for (let j = 0; j < width; j++) {
                row.push("X");
            }
            newField.push(row);
        }
        let newCol0 = [];
        for (let i = 0; i < height; i++) {
            newCol0.push("X");
        }
        let newCol1 = [];
        for (let i = 0; i < height; i++) {
            newCol1.push("X");
        }
        $potentialSources = newCol0;
        $finalLights = newCol1;
        $field = newField;
        rendered = !rendered;
        $deletingButtons = [];
        $wayOfLightArr = [];
        for (let i = 0; i < height; i++) {
            $wayOfLightArr.push([]);
            $deletingButtons.push([]);
        }
    }
    function handleWidth() {
        rendered = !rendered;
        let diff = width - oldWidth;
        oldWidth = width;
        let newField = [...$field];
        if (diff < 0) {
            diff = -diff;
            diff = diff / 2;
            for (let i = 0; i < diff; i++) {
                for (let j = 0; j < height; j++) {
                    newField[j].pop();
                    newField[j].shift();
                }
            }
        } else if (diff > 0) {
            diff = diff / 2;
            for (let i = 0; i < diff; i++) {
                for (let j = 0; j < height; j++) {
                    newField[j].push("X");
                    newField[j].unshift("X");
                }
            }
        }
        $field = [...newField];
        gridColm = "52px ";
        for (let i = 0; i < width - 1; i++) {
            gridColm = gridColm + "52px ";
        }
        $wayOfLightArr = [];
        for (let i = 0; i < width; i++) {
            $wayOfLightArr.push([]);
        }
        handleClear();
    }
</script>

{#key renderSettings}
    <body>
        <section class="playground">
            {#key width}
                {#key $finalLights}
                    {#key rendered}
                        <div class="interactive">
                            <div
                                class="sources"
                                style:grid-template-rows={gridRows}
                            >
                                {#each $field as row, index}
                                    <SensorField
                                        row={index}
                                        isLightField={true}
                                    />
                                {/each}
                            </div>
                            <div
                                class="table"
                                style:grid-template-rows={gridRows}
                                style:grid-template-columns={gridColm}
                            >
                                {#each $field as row, i}
                                    {#each $field[0] as col, j}
                                        <SensorField
                                            row={i}
                                            col={j}
                                            isFinalLightField={false}
                                            isLightField={false}
                                        />
                                    {/each}
                                {/each}
                            </div>
                            <div
                                class="sources"
                                style:grid-template-rows={gridRows}
                            >
                                {#each $field as row, index}
                                    <SensorField
                                        row={index}
                                        isFinalLightField={true}
                                    />
                                {/each}
                            </div>
                        </div>
                    {/key}
                {/key}
            {/key}
            <div class="selection">
                <SelectingButton color={"rgb(106, 106, 106)"} />
                <SelectingButton color={"#f24241"} />
                <SelectingButton color={"#f24242"} />
                <SelectingButton color={"rgb(73, 73, 255)"} />
                <SelectingButton color={"#e6e6e6"} />
                <SelectingButton color={"rgb(108, 108, 108)"} />
            </div>
            <h6>
                Made with
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    ><path
                        fill="currentColor"
                        d="m8.962 18.91l.464-.588l-.464.589ZM12 5.5l-.54.52a.75.75 0 0 0 1.08 0L12 5.5Zm3.038 13.41l.465.59l-.465-.59Zm-5.612-.588C7.91 17.127 6.253 15.96 4.938 14.48C3.65 13.028 2.75 11.334 2.75 9.137h-1.5c0 2.666 1.11 4.7 2.567 6.339c1.43 1.61 3.254 2.9 4.68 4.024l.93-1.178ZM2.75 9.137c0-2.15 1.215-3.954 2.874-4.713c1.612-.737 3.778-.541 5.836 1.597l1.08-1.04C10.1 2.444 7.264 2.025 5 3.06C2.786 4.073 1.25 6.425 1.25 9.137h1.5ZM8.497 19.5c.513.404 1.063.834 1.62 1.16c.557.325 1.193.59 1.883.59v-1.5c-.31 0-.674-.12-1.126-.385c-.453-.264-.922-.628-1.448-1.043L8.497 19.5Zm7.006 0c1.426-1.125 3.25-2.413 4.68-4.024c1.457-1.64 2.567-3.673 2.567-6.339h-1.5c0 2.197-.9 3.891-2.188 5.343c-1.315 1.48-2.972 2.647-4.488 3.842l.929 1.178ZM22.75 9.137c0-2.712-1.535-5.064-3.75-6.077c-2.264-1.035-5.098-.616-7.54 1.92l1.08 1.04c2.058-2.137 4.224-2.333 5.836-1.596c1.659.759 2.874 2.562 2.874 4.713h1.5Zm-8.176 9.185c-.526.415-.995.779-1.448 1.043c-.452.264-.816.385-1.126.385v1.5c.69 0 1.326-.265 1.883-.59c.558-.326 1.107-.756 1.62-1.16l-.929-1.178Z"
                    /></svg
                >
                by Christoph
            </h6>
        </section>
        {#if renderSettings}
            <section class="settings">
                <div class="settings--inner">
                    <h1>Einstellungen</h1>
                    <div class="slide--controller">
                        <label for="width">Weite</label>
                        <input
                            on:change={() => handleWidth()}
                            bind:value={width}
                            id="width"
                            type="range"
                            min="2"
                            max="8"
                            step="2"
                            class="slider"
                        />
                    </div>
                    <div class="checkboxes">
                        <div class="checkbox">
                            <input
                                type="checkbox"
                                id="hoverEffect"
                                bind:checked={$previewPlacement}
                            />
                            <label for="hoverEffect">Preview</label>
                        </div>
                        <div class="checkbox">
                            <input
                                type="checkbox"
                                id="wayOfLight"
                                bind:checked={$wayOfLights}
                            />
                            <label for="wayOfLight">Weg des Lichts</label>
                        </div>
                        <div class="checkbox">
                            <input
                                type="checkbox"
                                id="soundEffect"
                                bind:checked={$soundEffects}
                            />
                            <label for="soundEffect">Soundeffekte</label>
                        </div>
                    </div>
                    <div class="blue--buttons">
                        <button
                            on:click={() => handleClear()}
                            class="refresh--button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                viewBox="0 0 24 24"
                                ><path
                                    fill="currentColor"
                                    d="M17.65 6.35a7.95 7.95 0 0 0-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 0 0 7.21-4.56c.32-.67-.16-1.44-.9-1.44c-.37 0-.72.2-.88.53a5.994 5.994 0 0 1-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z"
                                /></svg
                            >
                        </button>
                        <button
                            on:click={() => handleHelp()}
                            class="refresh--button help"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                viewBox="0 0 24 24"
                                ><path
                                    fill="currentColor"
                                    d="M11.95 18q.525 0 .888-.363t.362-.887q0-.525-.362-.888t-.888-.362q-.525 0-.887.363t-.363.887q0 .525.363.888t.887.362Zm-.9-3.85h1.85q0-.825.188-1.3t1.062-1.3q.65-.65 1.025-1.238T15.55 8.9q0-1.4-1.025-2.15T12.1 6q-1.425 0-2.313.75T8.55 8.55l1.65.65q.125-.45.563-.975T12.1 7.7q.8 0 1.2.438t.4.962q0 .5-.3.938t-.75.812q-1.1.975-1.35 1.475t-.25 1.825ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z"
                                /></svg
                            >
                        </button>
                    </div>
                </div>
            </section>
        {/if}
        <button
            class="toggle--settings"
            on:click={() => (renderSettings = !renderSettings)}
        >
            {#if renderSettings}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    viewBox="0 0 24 24"
                    ><path
                        fill="currentColor"
                        d="M6.225 4.811a1 1 0 0 0-1.414 1.414L10.586 12L4.81 17.775a1 1 0 1 0 1.414 1.414L12 13.414l5.775 5.775a1 1 0 0 0 1.414-1.414L13.414 12l5.775-5.775a1 1 0 0 0-1.414-1.414L12 10.586L6.225 4.81Z"
                    /></svg
                >
            {:else}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    viewBox="0 0 24 24"
                    ><g
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        ><path
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065z"
                        /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0" /></g
                    ></svg
                >
            {/if}
        </button>
    </body>
{/key}

<style>
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;600;700&display=swap");
    body {
        font-family: "Poppins", sans-serif;
        margin: 0px;
        padding: 0px;
        height: 100vh;
        width: 100vw;

        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: center;
    }
    .playground {
        width: 80vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    }
    .interactive {
        margin-left: auto;
        margin-right: auto;
        margin-top: 20vh;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .sources {
        padding-left: 1px;
        padding-right: 1px;
        width: 52px;
        background-color: #c6c6c6;
        margin-right: 25px;
        margin-left: 25px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        padding-top: 1px;
        padding-bottom: 1px;
    }
    .table {
        background-color: #c6c6c6;
        display: grid;
        padding-top: 1px;
        padding-bottom: 1px;
        padding-left: 2px;
        position: relative;
    }
    .selection {
        width: 550px;
        height: 600px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-left: auto;
        margin-right: auto;
        margin-top: 50px;
    }
    .settings {
        height: 100vh;
        width: 300px;
        border-left-style: solid;
        border-left-color: #999;
        border-left-width: 1px;
        font-size: 1.15rem;
    }
    .settings--inner {
        height: 60vh;
        margin-left: auto;
        margin-right: auto;
        width: 12vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
    }
    .settings--inner > h1 {
        font-weight: 500;
        font-size: 1.5rem;
        color: #2b2b2b;
        margin-top: 180px;
    }
    .toggle--settings {
        position: absolute;
        top: 50px;
        right: 50px;
        border-style: none;
        background: transparent;
        color: #2b2b2b;
        transition: 0.5s;
        padding: 0px;
    }
    .toggle--settings > svg:hover {
        transform: scale(1.1);
        transform-origin: center;
    }
    .slide--controller {
        display: flex;
        flex-direction: column;
    }
    .checkbox {
        padding-top: 4px;
        padding-bottom: 4px;
    }
    .checkbox > input {
        height: 15px;
        width: 15px;
    }
    .blue--buttons {
        margin-top: 20px;
        width: 125px !important;
        height: 100px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: auto;
    }
    .refresh--button {
        border-style: none;
        border-radius: 30px;
        background-color: #3584e4;
        color: #fff;
        padding: 5px;
        margin: 5px;
    }
    .refresh--button > svg {
        padding-top: 2px;
        padding-left: 2px;
        padding-right: 2px;
    }
    .help > svg {
        padding-bottom: 2px;
    }
    .refresh--button > svg:active {
        animation: rotate 0.4s;
    }
    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .help {
        background-color: #fff;
        color: #2b2b2b;
        border: solid;
        border-width: 0.5px;
        border-color: #2b2b2b;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .help:hover,
    .refresh--button:hover {
        filter: brightness(70%);
    }
    h6 {
        width: 150px;
        text-align: center;
        margin-top: 45px;
        font-weight: 500;
        color: #777;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    h6 > svg {
        margin-left: 2px;
        margin-right: 2px;
    }
    @media screen and (max-width: 1000px) {
        .settings {
            position: absolute;
            z-index: 10;
            min-width: 400px;
            overflow-x: hidden;
            width: 100vw !important;
            background: #fff;
        }
        body {
            overflow-x: hidden;
            margin: 0;
            box-sizing: 0;
            position: absolute;
            top: 0px;
        }
        .toggle--settings {
            position: absolute;
            z-index: 11;
            top: 50px;
            right: 50px;
            border-style: none;
            background: transparent;
            color: #2b2b2b;
            transition: 0.5s;
            padding: 0px;
        }
        .settings--inner {
            width: 50vw !important;
        }
    }

    @media screen and (max-width: 1000px) and (max-height: 1000px) {
        .playground {
            justify-content: space-evenly;
            position: relative;
        }
        .interactive {
            position: absolute;
            top: -10%;
            transform: translate(-50%, -50%);
            font-size: 10px;
            transform: scale(0.5);
            transform-origin: center;
        }
        .selection {
            height: 100px;
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 10px;
            transform: scale(0.5);
            transform-origin: center;
        }
        h6 {
            position: absolute;
            top: 80%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 10px;
        }
    }
</style>
