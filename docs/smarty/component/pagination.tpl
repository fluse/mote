{*
    @author  Holger Schauf
    @created 22.09.2014
*}
{strip}

    {* settings *}

    {assign var="pagination" value=[
        'now' => 1,
        'from' => 5,
        'suffixUrl' => '',
        'noBounds' => false
    ]}

    {* checks *}

    {if true === $debug && (!isset($now) || !isset($from))}
        {assign var="now" value=$pagination.now}
        {assign var="from" value=$pagination.from}

        {include file="debug/alert.tpl" msg="variable $now and $from missing"}
    {/if}

    {if !isset($noBounds)}
        {assign var="noBounds" value=$pagination.noBounds}
    {/if}

    {if !isset($suffixUrl)}
        {assign var="suffixUrl" value=$pagination.suffixUrl}
    {/if}

    {* syntax *}

    <ul class="pagination {if isset($css) && !empty($css)} {$css}{/if}">

        {if true === $noBounds && $count !== 1}
            <li class="edg-prev">
                <a href="{$prefixUrl}{math equation="x - y" x=$active y=1}{$suffixUrl}">
                    {translate key="[pagination:previous]"}
                </a>
            </li>
        {/if}

        {for $now to $to}

            <li{if $i === $active} class="active"{/if}>
                <a href="{$prefixUrl|cat:$now|cat:$suffixUrl}">{$now}</a>
            </li>

        {/for}

        {if true === $noBounds}
            <li class="edg-next">
                <a href="{$prefixUrl}{math equation="x + y" x=$active y=1}{$suffixUrl}">
                    {translate key="[pagination:next]"}
                </a>
            </li>
        {/if}

    </ul>

{/strip}