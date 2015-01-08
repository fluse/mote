{*
    @author  Holger Schauf
    @created 25.09.2014
*}
{strip}

    {* settings *}

    {assign var="tabs" value=[
        'vertical' => false,
        'items' => 5,
        'suffixUrl' => '',
        'noBounds' => false
    ]}

    {* checks *}

    {if true === $debug && (!isset($items) || empty($items))}
        {assign var="items" value=$tabs.items}

        {include file="debug/alert.tpl" msg="variable $items missing"}
    {/if}

    {if !isset($suffixUrl)}
        {assign var="suffixUrl" value=$pagination.suffixUrl}
    {/if}

    {* syntax *}

    <nav class="tabs{$position}{if isset($css) && !empty($css)} {$css}{/if}">

        <ul class="grd-{$items|@count}-each">

            {foreach from=$items item="item"}

                <li{if $i === $active} class="active"{/if}>
                    <a href="{$prefixUrl|cat:$now|cat:$suffixUrl}">{$now}</a>
                </li>

            {/foreach}

        </ul>
    </nav>

{/strip}