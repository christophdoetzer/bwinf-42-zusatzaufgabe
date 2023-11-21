<script lang="ts">
    import { onMount } from "svelte";
    import { deletingButtons, selected, wayOfLights } from "../store";
    import { field } from "../store";
    import { lights } from "../store";
    import { originalLights } from "../store";
    import { potentialSources } from "../store";
    import { finalLights } from "../store";
    import { wayOfLightArr } from "../store";
    import { soundEffects } from "../store";

    import { preview } from "../store";
    import { previewPlacement } from "../store";
    import { hoversOverMainFields } from "../store";

    export let isLightField = false;
    export let isFinalLightField = false;
    export let row = 0;
    export let col = 0;
    let wasInSensor = false;
    let hovered = false;
    let isBig = true;
    let isIpad = false;
    onMount(() => {
        if (window.matchMedia("(max-width: 1000px)").matches) {
            isBig = false;
        }
        if (
            window.matchMedia("(min-width: 800px)").matches &&
            window.matchMedia("(min-height: 800px)").matches &&
            window.matchMedia("(max-width: 1200px)").matches &&
            window.matchMedia("(max-height: 1000px)").matches
        ) {
            isIpad = true;
        }
    });

    function handleMouseUp(event) {
        event.stopPropagation();
    }

    function checkField() {
        let orgLights = [];
        for (let i = 0; i < $potentialSources.length; i++) {
            if ($potentialSources[i] == "L") {
                orgLights.push(i);
            }
        }
        $wayOfLightArr = [];
        $lights = orgLights;
        for (let i = 0; i < $field[0].length; i++) {
            for (let j = 0; j < $field.length; j++) {
                if ($field[j][i] != "X" && !wasInSensor) {
                    if ($field[j][i] == "B") {
                    } else if ($field[j][i] == "W") {
                        if ($lights.includes(j) && !$lights.includes(j + 1)) {
                            $lights.push(j + 1);
                        } else if (
                            !$lights.includes(j) &&
                            $lights.includes(j + 1)
                        ) {
                            $lights.push(j);
                        } else if (
                            !$lights.includes(j) &&
                            !$lights.includes(j + 1)
                        ) {
                            $lights.push(j);
                            $lights.push(j + 1);
                        } else if (
                            $lights.includes(j) &&
                            $lights.includes(j + 1)
                        ) {
                            $lights.splice($lights.indexOf(j), 1);
                            $lights.splice($lights.indexOf(j + 1), 1);
                        }
                    } else if ($field[j][i] == "R") {
                        if ($lights.includes(j)) {
                            $lights.splice($lights.indexOf(j), 1);
                            if ($lights.includes(j + 1)) {
                                $lights.splice($lights.indexOf(j + 1), 1);
                            }
                        } else if (!$lights.includes(j)) {
                            $lights.push(j);
                            if (!$lights.includes(j + 1)) {
                                $lights.push(j + 1);
                            }
                        }
                    } else if ($field[j][i] == "r") {
                        if ($lights.includes(j + 1)) {
                            if ($lights.includes(j)) {
                                $lights.splice($lights.indexOf(j), 1);
                            }
                            $lights.splice($lights.indexOf(j + 1), 1);
                        } else if (!$lights.includes(j + 1)) {
                            $lights.push(j + 1);
                            if (!$lights.includes(j)) {
                                $lights.push(j);
                            }
                        }
                    }
                    wasInSensor = true;
                } else if ($field[j][i] == "X") {
                    wasInSensor = false;
                    if ($lights.includes(j)) {
                        $lights.splice($lights.indexOf(j), 1);
                    }
                } else if ($field[j][i] != "X" && wasInSensor) {
                    wasInSensor = false;
                }
            }
            $wayOfLightArr.push([...$lights]);
        }
    }
    function handleClick() {
        if ($selected == "-") {
            alert("Kein Baustein ausgewählt");
        }
        if ($selected == "rgb(106, 106, 106)") {
            if ($potentialSources[row] != "L") {
                if (isLightField) {
                    $originalLights.push(row);
                    $potentialSources[row] = "L";
                    if ($soundEffects) {
                        let sound = new Audio("/place.mp3");
                        sound.play();
                    }
                } else {
                    alert("Kann nur auf der linken Spalte plaziert werden.");
                }
            } else if ($potentialSources[row] == "L") {
                alert("Schon plaziert.");
            }
        } else if ($selected == "rgb(108, 108, 108)") {
            if ($finalLights[row] != "L") {
                if (isFinalLightField) {
                    $finalLights[row] = "L";
                    if ($soundEffects) {
                        let sound = new Audio("/place.mp3");
                        sound.play();
                    }
                } else {
                    alert("Kann nur auf der rechten Spalte plaziert werden.");
                }
            } else if ($finalLights[row] == "L") {
                alert("Schon plaziert.");
            }
        } else if (
            row - 1 >= 0 &&
            $field[row][col] == "X" &&
            $field[row - 1][col] == "X" &&
            ($hoversOverMainFields || !isBig || isIpad)
        ) {
            $deletingButtons[row - 1].push(col);
            $deletingButtons = [...$deletingButtons];
            if ($selected == "rgb(73, 73, 255)") {
                $field[row][col] = "B";
                $field[row - 1][col] = "B";
            } else if ($selected == "#f24242") {
                $field[row][col] = "R";
                $field[row - 1][col] = "r";
            } else if ($selected == "#f24241") {
                $field[row][col] = "r";
                $field[row - 1][col] = "R";
            } else if ($selected == "#e6e6e6") {
                $field[row][col] = "W";
                $field[row - 1][col] = "W";
            }
            if ($soundEffects) {
                let sound = new Audio("/place.mp3");
                sound.play();
            }
        } else {
            $hoversOverMainFields = $hoversOverMainFields;
            alert("Element kann nicht plaziert werden.");
        }
        checkField();
    }
    let color = "";
    $: if (
        (row == $preview[0][0] &&
            col == $preview[0][1] &&
            $previewPlacement &&
            $hoversOverMainFields &&
            !isFinalLightField &&
            !isLightField &&
            $selected != "rgb(108, 108, 108)" &&
            $selected != "-" &&
            $selected != "rgb(106, 106, 106)") ||
        (row == $preview[1][0] &&
            col == $preview[1][1] &&
            $previewPlacement &&
            $hoversOverMainFields &&
            $selected != "-" &&
            !isFinalLightField &&
            !isLightField)
    ) {
        color = $selected;
        hovered = true;
    } else if (
        row == $preview[0][0] &&
        isLightField &&
        preview &&
        $selected == "rgb(106, 106, 106)" &&
        $potentialSources[row][0] == "X"
    ) {
        color = $selected;
        hovered = true;
    } else if (
        row == $preview[0][0] &&
        isFinalLightField &&
        !isLightField &&
        preview &&
        $selected == "rgb(108, 108, 108)" &&
        $finalLights[row][0] == "X"
    ) {
        color = $selected;
        hovered = true;
    } else if (
        ($potentialSources[row] == "X" && isLightField) ||
        ($finalLights[row] == "X" && isFinalLightField)
    ) {
        color = "#fff";
        hovered = false;
    } else if ($potentialSources[row] == "L" && isLightField) {
        color = "rgb(106, 106,106)";
        hovered = false;
    } else if ($finalLights[row] == "L" && isFinalLightField) {
        color = "rgb(108, 108, 108)";
        hovered = false;
    } else if ($field[row][col] == "B") {
        color = "rgb(73, 73, 255)";
        hovered = false;
    } else if ($field[row][col] == "W") {
        color = "#e6e6e6";
        hovered = false;
    } else if ($field[row][col] == "R" || $field[row][col] == "r") {
        color = "#f24241";
        hovered = false;
    } else {
        color = "#fff";
        hovered = false;
    }
    function handleMouseOver() {
        if (isLightField || isFinalLightField) {
            $hoversOverMainFields = false;
        } else {
            $hoversOverMainFields = true;
        }
        if (
            row != 0 &&
            $field[row][col] == "X" &&
            $field[row - 1][col] == "X" &&
            $selected != "rgb(108, 108, 108)" &&
            $selected != "rgb(106, 106, 106)"
        ) {
            preview.update((arr) => [
                [row, col],
                [row - 1, col],
            ]);
        } else if (
            row != 0 &&
            $field[row][col] == "X" &&
            $field[row - 1][col] == "X" &&
            $selected != "rgb(108, 108, 108)" &&
            $selected != "rgb(106, 106, 106)"
        ) {
            preview.update((arr) => [[], []]);
        } else if (
            isFinalLightField &&
            $finalLights[row] == "X" &&
            $selected == "rgb(108, 108, 108)"
        ) {
            preview.update((arr) => [[row], []]);
        } else if (
            isLightField &&
            $potentialSources[row] == "X" &&
            $selected == "rgb(106, 106, 106)"
        ) {
            preview.update((arr) => [[row], []]);
        }
    }
    function handleMouseOut() {
        $preview = [[], []];
    }
    function clicked() {}
    function handleDelete(event) {
        event.stopPropagation();
        $deletingButtons[row].splice($deletingButtons[row].indexOf(col), 1);
        $field[row][col] = "X";
        $field[row + 1][col] = "X";
        checkField();
    }
</script>

{#if $finalLights[row] == "L" && isFinalLightField && $lights.includes(row)}
    <button
        on:click={handleClick}
        style:background-color={color}
        class="lightOn"
        class:hovered
    >
        <div class="sensor" />
        <button
            class="deletingButton"
            on:mouseup={handleMouseUp}
            on:click={(event) => {
                $finalLights[row] = "X";
                checkField();
                event.stopPropagation();
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                ><path
                    fill="currentColor"
                    d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8s8-3.582 8-8s-3.581-8-8-8zm3.707 10.293a.999.999 0 1 1-1.414 1.414L12 13.414l-2.293 2.293a.997.997 0 0 1-1.414 0a.999.999 0 0 1 0-1.414L10.586 12L8.293 9.707a.999.999 0 1 1 1.414-1.414L12 10.586l2.293-2.293a.999.999 0 1 1 1.414 1.414L13.414 12l2.293 2.293z"
                /></svg
            >
        </button>
    </button>
{:else}
    <button
        on:mouseup={() => {
            setTimeout(function () {
                if (!isLightField && !isFinalLightField) {
                    if ($field[row][col] == "X") {
                        handleClick();
                    }
                } else if (isLightField) {
                    if ($potentialSources[row] == "X") {
                        handleClick();
                    }
                } else if (isFinalLightField) {
                    if ($finalLights[row] == "X") {
                        handleClick();
                    }
                }
            }, 50);
        }}
        on:click={() => {
            handleClick();
        }}
        on:focus={() => clicked()}
        on:blur={() => clicked()}
        on:mouseover={() => handleMouseOver()}
        on:mouseout={() => handleMouseOut()}
        style:background-color={color}
        style:margin-top="1px"
        style:margin-bottom="1px"
        class:hovered
    >
        {#if !isLightField && !isFinalLightField}
            {#if $field[row][col] == "R" || $field[row][col] == "B" || $field[row][col] == "W"}
                <div class="sensor" />
                {#if $deletingButtons[row].includes(col)}
                    <button
                        class="deletingButton"
                        on:click={handleDelete}
                        on:mouseup={handleMouseUp}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            ><path
                                fill="currentColor"
                                d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8s8-3.582 8-8s-3.581-8-8-8zm3.707 10.293a.999.999 0 1 1-1.414 1.414L12 13.414l-2.293 2.293a.997.997 0 0 1-1.414 0a.999.999 0 0 1 0-1.414L10.586 12L8.293 9.707a.999.999 0 1 1 1.414-1.414L12 10.586l2.293-2.293a.999.999 0 1 1 1.414 1.414L13.414 12l2.293 2.293z"
                            /></svg
                        >
                    </button>
                {/if}
            {:else if $field[row][col] == "r" && $deletingButtons[row].includes(col)}
                <button
                    class="deletingButton"
                    on:click={handleDelete}
                    on:mouseup={handleMouseUp}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        ><path
                            fill="currentColor"
                            d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8s8-3.582 8-8s-3.581-8-8-8zm3.707 10.293a.999.999 0 1 1-1.414 1.414L12 13.414l-2.293 2.293a.997.997 0 0 1-1.414 0a.999.999 0 0 1 0-1.414L10.586 12L8.293 9.707a.999.999 0 1 1 1.414-1.414L12 10.586l2.293-2.293a.999.999 0 1 1 1.414 1.414L13.414 12l2.293 2.293z"
                        /></svg
                    >
                </button>
            {/if}
        {:else if $potentialSources[row] == "L" && isLightField}
            <div
                class="sensor"
                style:border-radius="3px 0px 0px 3px"
                style:height="50px"
                style:margin-left="35px"
                style:background-color="#ecc83a"
            />
            <button
                class="deletingButton"
                style:margin-right="5px"
                on:mouseup={handleMouseUp}
                on:click={(event) => {
                    $potentialSources[row] = "X";
                    checkField();
                    event.stopPropagation();
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    ><path
                        fill="currentColor"
                        d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8s8-3.582 8-8s-3.581-8-8-8zm3.707 10.293a.999.999 0 1 1-1.414 1.414L12 13.414l-2.293 2.293a.997.997 0 0 1-1.414 0a.999.999 0 0 1 0-1.414L10.586 12L8.293 9.707a.999.999 0 1 1 1.414-1.414L12 10.586l2.293-2.293a.999.999 0 1 1 1.414 1.414L13.414 12l2.293 2.293z"
                    /></svg
                >
            </button>
        {:else if $finalLights[row] == "L" && isFinalLightField}
            <div class="sensor" />
            <button
                class="deletingButton"
                on:mouseup={handleMouseUp}
                on:click={(event) => {
                    $finalLights[row] = "X";
                    checkField();
                    event.stopPropagation();
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    ><path
                        fill="currentColor"
                        d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8s8-3.582 8-8s-3.581-8-8-8zm3.707 10.293a.999.999 0 1 1-1.414 1.414L12 13.414l-2.293 2.293a.997.997 0 0 1-1.414 0a.999.999 0 0 1 0-1.414L10.586 12L8.293 9.707a.999.999 0 1 1 1.414-1.414L12 10.586l2.293-2.293a.999.999 0 1 1 1.414 1.414L13.414 12l2.293 2.293z"
                    /></svg
                >
            </button>
        {/if}
        {#if !isLightField && !isFinalLightField && $wayOfLights && $wayOfLightArr[col].includes(row)}
            <div class="light" />
        {/if}
    </button>
{/if}

<style>
    button {
        height: 50px;
        width: 50px;
        background: #fff;
        border: none;
        padding: 0;
        position: relative;
    }
    .sensor {
        border-radius: 0px 70px 70px 0px;
        height: 30px;
        width: 15px;
        background-color: #2b2b2b;
    }
    .lightOn {
        filter: drop-shadow(30px 0px #ecc83a);
        margin-top: 1px;
        margin-bottom: 1px;
    }
    .hovered {
        opacity: 50%;
    }
    .light {
        position: absolute;
        height: 50px;
        width: 10px;
        left: 40px;
        bottom: 0px;
        background-color: #ecc83a;
    }
    .deletingButton {
        position: absolute;
        right: 5px;
        top: 0px;
        height: 25px;
        width: 25px;
        display: block;
        background: transparent;
        z-index: 1;
    }
    .deletingButton > svg:hover {
        transform: scale(1.1);
        transform-origin: center;
    }
</style>
