<script>
    import { selected } from "../store";
    export let color = "";
    const handleClick = () => {
        selected.set(color);
    };
</script>

{#if color == "rgb(106, 106, 106)"}
    <button on:click={handleClick} on:mousedown={handleClick}>
        <div
            class:selected={$selected == color}
            style:background-color={color}
            style:height="50px"
            class="small--sensor"
        >
            <div
                class="sensor"
                style:background-color="rgb(236, 200, 58)"
                style:height="inherit"
                style:width="15px"
                style:margin-left="40px"
                style:border-radius="0px 3px 3px 0px"
            />
        </div>
    </button>
{:else if color == "rgb(108, 108, 108)"}
    <button on:click={handleClick} on:mousedown={handleClick}>
        <div
            class:selected={$selected == color}
            style:background-color={color}
            style:height="50px"
            class="small--sensor"
            style:display="flex"
            style:align-items="center"
        >
            <div
                class="sensor"
                style:background-color="#2b2b2b"
                style:margin-right="30px"
                style:height="35px"
                style:border-radius="0px 70px 70px 0px"
            />
        </div>
    </button>
{:else}
    <button on:click={handleClick} on:mousedown={handleClick}>
        <div style:background-color={color} class:selected={$selected == color}>
            {#if color == "#f24242"}
                <div class="sensor--red" style:margin-top="55px" />
            {:else if color == "#f24241"}
                <div class="sensor--red" />
            {:else}
                <div
                    class="sensor"
                    style:height="35px"
                    style:margin-top="10px"
                    style:border-radius="0px 70px 70px 0px"
                />
                <div
                    class="sensor"
                    style:height="35px"
                    style:margin-top="55px"
                    style:border-radius="0px 70px 70px 0px"
                />
            {/if}
        </div>
    </button>
{/if}

<style>
    .selected {
        filter: brightness(60%);
    }
    .sensor {
        height: inherit;
        width: 20px;
        background-color: #2b2b2b;
    }
    .sensor--red {
        margin-top: 15px;
        height: 35px;
        width: 20px;
        background-color: #2b2b2b;
        border-radius: 3px 70px 70px 3px;
    }
    button {
        width: 90px;
        padding: 15px;
        background: #fff;
        border-style: none;
    }
    button > div {
        position: relative;
        padding: 0px;
        border-style: none;
        width: 55px;
        height: 100px;
        border-radius: 3px;
    }
    button > div:hover {
        transform: scale(1.05);
        transform-origin: center;
    }
    button > div > div {
        position: absolute;
    }
    .small--sensor:hover {
        height: 55px !important;
    }
</style>
