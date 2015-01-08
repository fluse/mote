{*
    @author  Holger Schauf
    @created 22.09.2014
*}
{strip}

    {* settings *}

    {assign var="toggle" value=[
        'id' => 'tgl',
        'name' => 'toggle',
        'tagName' => 'span',
        'translation' => 'no toggle translation'
    ]}

    {* checks *}

    {if !isset($id) || empty($id)}
        {assign var="id" value=$toggle.id}
    {/if}

    {if !isset($translation) || empty($translation)}
        {assign var="translation" value=$toggle.translation}
    {/if}

    {if !isset($tagName) || empty($tagName)}
        {assign var="tagName" value=$toggle.tagName}
    {/if}

    {if !isset($name) || empty($name)}
        {assign var="name" value=$toggle.name}

        {include file="debug/alert.tpl" msg=$toggle.name}
    {/if}

    {* syntax *}

    <{$tagName} class="toggle{if isset($css) && !empty($css)} {$css}{/if}">

        <input type="checkbox" id="{$id}" name="{$name}" />

        <label for="{$id}">
            {$translation}
        </label>

    </{$tagName}>

{/strip}