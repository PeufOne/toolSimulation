<script>
	import { onMount, onDestroy } from 'svelte'
	import { fly } from 'svelte/transition'
    import { getHeader } from './utils'
    
	export let body = {}        // donnée qui seront patché
	export let source = ''      // id de l'élément écouté
	export let invalid = ''     
	export let path = ''        // url http PATCH
	export let changeFlag = false
    
	const WAIT_FOR_PATCH = 600
	let waiting
	let onModify = false
	let patched
	let patchCount = 0
	let waitingOnAction // For hide
    let onAction = false
    
	onMount(() => {
		document.getElementById(source).addEventListener('input', testInput)
		document.getElementById(source).addEventListener('click', testClick)
	})
	
	let firstChangeFlag = true
	$: {
		if (!firstChangeFlag) {
			changeFlag
			change()
			changeFlag = false		
		}
		firstChangeFlag = false
	}
	function testInput(e) {
		if(!e.target.classList.contains('searchUser')) {
			change()
		}
	}
	function testClick(e) {
		if(e.target.classList.contains('patchButton')) {
			change()
		}
	}
	function change() {
		onModify = true
		onAction = true
		clearTimeout(waiting)
		clearTimeout(waitingOnAction)
		if (!invalid) waiting = setTimeout(getPatched, WAIT_FOR_PATCH)
	}
	function getPatched() {
		onModify = false
		patched = patch()
	}
	async function patch() {
		patchCount++
		const res = await fetch(path, getHeader(body, 'PATCH'))
		const json = await res.json()
		patchCount--
		if (res.ok) {
			if (patchCount == 0 && !onModify) {
				waitingOnAction = setTimeout(() => onAction = false, 1000)
			}
			return 
		}else{
			console.log('Patch impossible : ', json.message)
			return Error('Echec de le mise a jour')
		}
	}
</script>


{#if onAction}
	<div class="w3-card w3-padding w3-round" transition:fly={{x: -100}}>
		{#if !!invalid}
			<i class="fas fa-exclamation-triangle"></i>
			{invalid}
		{:else if onModify}
			<i class="far fa-edit"></i>
			Modification...	
		{:else}
			{#await patched}
				<i class="fas fa-sync-alt w3-spin"></i>
				Sauvegarde...
			{:then}
				<i class="fas fa-check"></i>
				Sauvegardé
			{:catch error}
				<i class="fas fa-bug"></i>
				{error}
			{/await}
			
		{/if}

	</div>
{/if}

<style>
	div {
		position: absolute;
		background: white;
		left: 10px;
		bottom: 10px;
	}
</style>