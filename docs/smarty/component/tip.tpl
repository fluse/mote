{*
    @author  Holger Schauf
    @created 22.09.2014
*}
{strip}

    {* settings *}

    {assign var="tip" value=[
        'position' => 'yellow',
        'tagName' => 'span',
        'translation' => 'translation',
        'content' => 'no tooltip content'
    ]}

    {* checks *}

    {if !isset($content) || empty($content)}

        {assign var="content" value=$tip.content}

        {include file="debug/alert.tpl" msg=$content}
    {/if}

    {if !isset($translation) || empty($translation)}
        {assign var="translation" value=$tip.translation}
    {/if}

    {if !isset($position) || empty($position)}
        {assign var="position" value=$tip.position}
    {/if}

    {if !isset($tagName) || empty($tagName)}
        {assign var="tagName" value=$tip.tagname}
    {/if}

    {* syntax *}

    <{$tagName} class="tip-{$position}{if isset($css) && !empty($css)} {$css}{/if}" data-tip="{$content}">

        {$translation}

    </{$tagName}>

{/strip}