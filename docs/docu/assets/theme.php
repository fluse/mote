<?php
// @todo create theme customize script
class mote
{

    public $themes;
    public $themeDir = '../../../sass/themes/';
    public $optionList;

    public function createTheme ($name) {

        try {
            shell_exec('grunt theme -name=' . $name);
        } catch (Exception $e) {
            throw new Exception( 'Something really gone wrong', 0, $e);
        }

    }

    public function getThemes() {

        $this->themes = array_filter(glob('*'), $this->themeDir);
        $this->readFiles();

    }

    public function readFiles() {

        $themeLength = sizeof($this->themes);
        for ($theme = 0; $theme < $themeLength; $theme++) {

            $fileList = scandir($this->themes . $theme);

            $fileLength = sizeof($fileList);
            for ($file = 0; $file < $fileLength; $file) {

                $this->optionList[$theme] = $this->getFileContent($file);

            }

        }

    }

    public function getFileContent($file) {

        return fopen($file, "w");

    }
}

if (isset($_POST["create"])) {
    $response = mote::createTheme($_POST["create"]);
    echo $response;
}

if (isset($_POST["save"])) {
    $response = $mote::createTheme($_POST["create"]);
    echo $response;
}


