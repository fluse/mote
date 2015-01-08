{*
    @author  Holger Schauf
    @created 25.09.2014
*}
{strip}

    {* settings *}

    {assign var="layer" value=[
        'id' => 'lyr',
        'tagName' => 'div',
        'content' => 'no layer content'
    ]}

    {* checks *}

    {if !isset($id) || empty($id)}
        {assign var="id" value=$layer.id}
    {/if}

    {if !isset($tagName) || empty($tagName)}
        {assign var="tagName" value=$layer.tagName}
    {/if}

    {if !isset($content) || empty($content)}
        {assign var="content" value=$layer.content}

        {include file="debug/alert.tpl" msg=$content}
    {/if}

    {* syntax *}

    <{$tagName} id="{$id}" class="lyr{if isset($css) && !empty($css)} {$css}{/if}" hidden>

        {$content}

        {if isset($close) && $close === true}
            <i class="icn-close"></i>
        {/if}

    </{$tagName}>

{/strip}