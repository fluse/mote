{*
    @author  Holger Schauf
    @created 22.09.2014
*}
{strip}
    {if true === $debug}

        {* checks / settings *}

        {if !isset($msg)}
            {assign var="msg" value="are you stupid? you foggot the message xD"}
        {/if}

        {* syntax *}

        <script type="text/javascript">
            alert("{$msg}");
        </script>

    {/if}
{/strip}