{*
    @author  Holger Schauf
    @created 24.09.2014

    @types   highlight, popup, leftslide, fill
*}
{strip}

    {* settings *}

    {assign var="link" value=[
        'id' => 'lyr',
        'tagName' => 'a',
        'translation' => 'no translation'
    ]}

    {* checks *}

    {if !isset($translation) || empty($translation)}
        {assign var="translation" value=$link.translation}
    {/if}

    {if !isset($tagName) || empty($tagName)}
        {assign var="tagName" value=$link.tagName}
    {/if}

    {* syntax *}

    <{$tagName} class="lnk{if isset($css) && !empty($css)} {$css}{/if}">

        {$translation}

        {if isset($symbole) && !empty($symbole)}
            <i class="icn-{$symbole}"></i>
        {/if}

    </{$tagName}>

{/strip}