{*
    @author  Holger Schauf
    @created 24.09.2014
*}
{strip}

    {* settings *}

    {assign var="notification" value=[
        'tagName' => 'span',
        'content' => 'no content'
    ]}

    {* checks *}

    {if !isset($content) || empty($content)}
        {assign var="content" value=$notification.content}
    {/if}

    {if !isset($tagName) || empty($tagName)}
        {assign var="tagName" value=$notification.tagName}
    {/if}

    {* syntax *}

    <{$tagName} class="nfs-{$position} psn-fxd {if isset($css) && !empty($css)} {$css}{/if}">

        <{$tagName} class="ns-box-wrp">
            {$content}
        </{$tagName}>

        {if isset($close) && $close === true}
            <i class="icn-close"></i>
        {/if}

    </{$tagName}>

{/strip}