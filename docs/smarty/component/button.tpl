{*
    @author  Holger Schauf
    @created 23.09.2014

*}
{strip}

    {* settings *}

    {assign var="button" value=[
        'color' => 'grn',
        'tagName' => 'a',
        'translation' => 'no translation'
    ]}

    {* checks *}

    {if !isset($color) || empty($color)}
        {assign var="color" value=$button.color}
    {/if}

    {if !isset($translation) || empty($translation)}
        {assign var="translation" value=$button.translation}
    {/if}

    {if !isset($tagName)}}
        {if isset($url) && !empty($url)}
            {assign var="tagName" value=$button.tagName}
        {else}
            {assign var="tagName" value="button"}
        {/if}
    {/if}

    {* syntax *}

    <{$tagName} {if isset($url) && !empty($url)}href="{$url} {/if}class="btn{if isset($css) && !empty($css)} {$css}{/if}">

        <span class="bgc-{$color}">

            <strong>{$translation}</strong>

            {if !isset($symbole) || empty($symbole)}
                <i>{$symbole}</i>
            {/if}

        </span>

    </{$tagName}>

{/strip}