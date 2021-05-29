import React, { Component } from 'react';
import { RefreshControl , ActivityIndicator , AsyncStorage , Dimensions ,ScrollView,Platform,TouchableOpacity, StyleSheet, View, TextInput, Text, Image, ImageBackground, Linking, StatusBar, Alert } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { withNavigation ,  } from 'react-navigation';
import { DrawerActions } from "react-navigation-drawer";
import {Calendar, CalendarList, LocaleConfig} from 'react-native-calendars';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { LineChart, } from 'react-native-chart-kit';
import 'react-native-svg';
// import { LineChart, Grid , YAxis , XAxis } from 'react-native-svg-charts'
import normalize from 'react-native-normalize';
import Workouts from './Workout/Workouts.js';
import Schedule from './ClassSchedule/schedule.js';
import Nutritionplan from './NutritionPlan/nutritionplan.js';
import Message from './Message/message.js';
import { dashboardReportAction , dashboardReportWaistAction  , dashboardReportThighAction , dashboardReportArmsAction , dashboardReportHeightAction , dashboardReportChestAction , dashboardReportFatAction } from '../../util/action.js';
import moment from 'moment';
import { Item } from 'native-base';
import DropdownAlert from 'react-native-dropdownalert';
import {t} from '../../../locals';
import i18n from 'i18n-js';
import * as Localization from 'expo-localization';

const lang = i18n.locale = Localization.locale.substr(0, 2);
const today = moment().format('YYYY-MM-DD');

if (lang == 'it') {
    LocaleConfig.locales['it'] = {
        monthNames: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        monthNamesShort: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
        dayNames: ['DOMENICA', 'LUNEDI', 'MARTEDÌ', 'MERCOLEDÌ', 'GIOVEDI', 'VENERDÌ', 'SABATO'],
        dayNamesShort: ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB']
    };
    LocaleConfig.defaultLocale = 'it';
}
else if (lang=='ar'){
	LocaleConfig.locales['ar'] = {
        monthNames: ['كانون الثاني', 'شهر فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'تموز', 'أغسطس', 'شهر سبتمبر', 'اكتوبر', 'شهر نوفمبر', 'ديسمبر'],
        monthNamesShort: ['كانون الثاني', 'شهر فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'تموز', 'أغسطس', 'شهر سبتمبر', 'اكتوبر', 'شهر نوفمبر', 'ديسمبر'],
        dayNames: ['الأحد', 'الاثنين', 'يوم الثلاثاء', 'الأربعاء', 'يوم الخميس', 'جمعة', 'السبت'],
        dayNamesShort: ['الأحد', 'الاثنين', 'يوم الثلاثاء', 'الأربعاء', 'يوم الخميس', 'جمعة', 'السبت']
    };

    LocaleConfig.defaultLocale = 'ar';
}
else if (lang=='ca') {
    LocaleConfig.locales['ca'] = {
        monthNames: ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'de novembre', 'Desembre'],
        monthNamesShort: ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'],
        dayNames: ['DIUMENGE', 'DILLUNS', 'DIMARTS', 'DIMECRES', 'DIJOUS', 'DIVENDRES', 'DISSABTE'],
        dayNamesShort: ['Dg.', 'Dl.', 'Dt.', 'Dc.', 'Dj.', 'Dv.', 'Ds.']
    };

    LocaleConfig.defaultLocale = 'ca';
}
else if (lang=='cs'){
    LocaleConfig.locales['cs'] = {
        monthNames: ['Leden', 'Únor', 'březen', 'Duben', 'Smět', 'červen', 'červenec', 'Srpen', 'Září', 'říjen', 'Listopad', 'Prosinec'],
        monthNamesShort: ['Led', 'Úno', 'bře', 'Dub', 'Smě', 'Čer', 'čer', 'Srp', 'Zář', 'říj', 'Lis', 'Pro'],
        dayNames: ['NEDĚLE', 'PONDĚLÍ', 'ÚTERÝ', 'STŘEDA', 'ČTVRTEK', 'PÁTEK', 'SOBOTA'],
        dayNamesShort: ['NED.', 'PON.', 'ÚTE.', 'STŘ.', 'ČTV.', 'PÁT.', 'SOB.']
    };

    LocaleConfig.defaultLocale = 'cs';
}
else if(lang=='da') {
    LocaleConfig.locales['da'] = {
        monthNames: ['Januar', 'Februar', 'Marts', 'April', 'Kan', 'Juni', 'Juli', 'August', 'September', 'OKtober', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Kan', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
        dayNames: ['SØNDAG', 'MANDAG', 'TIRSDAG', 'ONSDAG', 'TORSDAG', 'FREDAG', 'LØRDAG'],
        dayNamesShort: ['SØN.', 'MAN.', 'TIR.', 'ONS.', 'TOR.', 'FRE.', 'LØR.']
    };

    LocaleConfig.defaultLocale = 'da';
}
else if(lang=='de'){
    LocaleConfig.locales['de'] = {
        monthNames: ['Januar', 'Februar', 'März', 'April', 'Kann', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Kan', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        dayNames: ['SONNTAG', 'MONTAG', 'DIENSTAG', 'MITTWOCH', 'DONNERSTAG', 'FREITAG', 'SAMSTAG'],
        dayNamesShort: ['SON.', 'MON.', 'DIE.', 'MIT.', 'DON.', 'FRE.', 'SAM.']
    };

    LocaleConfig.defaultLocale = 'de';
}
else if(lang=='el'){
    LocaleConfig.locales['el'] = {
        monthNames: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Ενδέχεται', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],
        monthNamesShort: ['Ιαν', 'Φεβ', 'Μάρ', 'Απρ', 'Ενδ', 'Ιούv', 'Ιούλ', 'Αύγ', 'Σεπ', 'Οκτ', 'Νοέ', 'Δεκ'],
        dayNames: ['ΚΥΡΙΑΚΗ', 'ΔΕΥΤΕΡΑ', 'ΤΡΙΤΗ', 'ΤΕΤΑΡΤΗ', 'ΠΕΜΠΤΗ', 'ΠΑΡΑΣΚΕΥΗ', 'ΣΑΒΒΑΤΟ'],
        dayNamesShort: ['ΚΥΡ.', 'ΔΕΥ.', 'ΤΡΙ.', 'ΤΕΤ.', 'ΠΕΜ.', 'ΠΑΡ.', 'ΣΑΒ.']
    };

    LocaleConfig.defaultLocale = 'el';
}
else if(lang=='es'){
    LocaleConfig.locales['es'] = {
        monthNames: ['Enero', 'Febrero', 'Marcha', 'Abril', 'Mayo', 'Junio', 'Mes de julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'],
        dayNamesShort: ['DOM.', 'LUN.', 'MAR.', 'MIÉ.', 'JUE.', 'VIE.', 'SÁB.']
    };

    LocaleConfig.defaultLocale = 'es';
}
else if(lang=='et'){
    LocaleConfig.locales['et'] = {
        monthNames: ['Jaanuar', 'Veebruar', 'Märts', 'Aprill', 'Mai', 'Juunil', 'Juuli', 'August', 'Septembrini', 'Oktoober', 'Novembrini', 'Detsembrini'],
        monthNamesShort: ['Jaa', 'Vee', 'Mär', 'Apr', 'Mai', 'Juun', 'Juul', 'Aug', 'Sep', 'Okt', 'Nov', 'Det'],
        dayNames: ['PÜHAPÄEV', 'ESMASPÄEV', 'TEISIPÄEV', 'KOLMAPÄEV', 'NELJAPÄEV', 'REEDE', 'LAUPÄEV'],
        dayNamesShort: ['PÜH.', 'ESM.', 'TEI.', 'KOL.', 'NEL.', 'REE.', 'LAU.']
    };

    LocaleConfig.defaultLocale = 'et';
}
else if(lang=='fa'){
    LocaleConfig.locales['fa'] = {
        monthNames: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'ممکن است', 'ژوئن', 'جولای', 'مرداد', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'],
        monthNamesShort: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'ممکن است', 'ژوئن', 'جولای', 'مرداد', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'],
        dayNames: ['یکشنبه', 'دوشنبه', 'سهشنبه', 'چهار شنبه', 'پنج شنبه', 'جمعه', 'شنبه'],
        dayNamesShort: ['یکشنبه', 'دوشنبه', 'سهشنبه', 'چهار شنبه', 'پنج شنبه', 'جمعه', 'شنبه']
    };

    LocaleConfig.defaultLocale = 'fa';
}
else if(lang=='fi'){
    LocaleConfig.locales['fi'] = {
        monthNames: ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Saattaa', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'],
        monthNamesShort: ['Tam', 'Hel', 'Maa', 'Huh', 'Saa', 'Kes', 'Hei', 'Elo', 'Syy', 'Lok', 'Mar', 'Jou'],
        dayNames: ['SUNNUNTAI', 'MAANANTAI', 'TIISTAI', 'KESKIVIIKKO', 'TORSTAI', 'PERJANTAI', 'Lauantai'],
        dayNamesShort: ['SON.', 'MON.', 'DIE.', 'MIT.', 'DON.', 'FRE.', 'SAM.']
    };

    LocaleConfig.defaultLocale = 'fi';
}
else if(lang=='fr'){
    LocaleConfig.locales['fr'] = {
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        monthNamesShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        dayNames: ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'],
        dayNamesShort: ['DIM.', 'LUN.', 'MAR.', 'MER.', 'JEU.', 'VEN.', 'SAM.']
    };
    LocaleConfig.defaultLocale = 'fr';
}
else if(lang=='hi'){
	LocaleConfig.locales['hi'] = {
        monthNames: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'],
        monthNamesShort: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'],
        dayNames: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
        dayNamesShort: ['रवि.', 'सोम.', 'मंगल.', 'बुध.', 'गुरु.', 'शुक्र.', 'शनि.']
    };
    LocaleConfig.defaultLocale = 'hi';
}
else if(lang=='hr') {
    LocaleConfig.locales['hr'] = {
        monthNames: ['Siječnja', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj', 'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'],
        monthNamesShort: ['Sij', 'Vel', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro'],
        dayNames: ['NEDJELJA', 'PONEDJELJAK', 'UTORAK', 'SRIJEDA', 'ČETVRTAK', 'PETAK', 'SUBOTA'],
        dayNamesShort: ['NED.', 'PON.', 'UTO.', 'SRI.', 'ČET.', 'PET.', 'SUB.']
    };

    LocaleConfig.defaultLocale = 'hr';
}
else if(lang=='hu'){
    LocaleConfig.locales['hu'] = {
        monthNames: ['Január', 'Február', 'Március', 'április', 'Lehet', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Már', 'ápr', 'Leh', 'jún', 'júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec'],
        dayNames: ['VASÁRNAP', 'HÉTFŐ', 'KEDD', 'SZERDA', 'CSÜTÖRTÖK', 'PÉNTEK', 'SZOMBAT'],
        dayNamesShort: ['VAS.', 'HÉT.', 'KED.', 'SZE.', 'CSÜ.', 'PÉN.', 'SZO.']
    };

    LocaleConfig.defaultLocale = 'hu';
}
else if(lang=='id'){
    LocaleConfig.locales['id'] = {
        monthNames: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        dayNames: ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'],
        dayNamesShort: ['MIN.', 'SEN.', 'SEL.', 'RAB.', 'KAM.', 'JUM.', 'SAB.']
    };

    LocaleConfig.defaultLocale = 'id';
}
else if(lang=='ja'){
    LocaleConfig.locales['ja'] = {
        monthNames: ['一月 ', '二月 ', '三月', '四月 ', '五月', '六月 ', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['一月 ', '二月 ', '三月', '四月 ', '五月', '六月 ', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        dayNames: ['日曜日', '月曜', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
        dayNamesShort: ['日曜日', '月曜', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']
    };

    LocaleConfig.defaultLocale = 'ja';
}
else if(lang=='lt'){
    LocaleConfig.locales['lt'] = {
        monthNames: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
        monthNamesShort: ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir', 'Lie', 'Rugp', 'Rugs', 'Spa', 'Lap', 'Gru'],
        dayNames: ['Sekmadienis', 'Pirmadienis', 'Antradienis', 'Trečiadienis', 'Ketvirtadienis', 'Penktadienis', 'Šeštadienis'],
        dayNamesShort: ['SEK.', 'PIR.', 'ANT.', 'TRE.', 'KET.', 'PEN.', 'ŠEŠ.']
    };

    LocaleConfig.defaultLocale = 'lt';
}
else if(lang=='nl'){
    LocaleConfig.locales['nl'] = {
        monthNames: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Maa', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
        dayNames: ['ZONDAG', 'MAANDAG', 'DINSDAG', 'WOENSDAG', 'DONDERDAG', 'VRIJDAG', 'ZATERDAG'],
        dayNamesShort: ['ZON.', 'MAAN.', 'DIN.', 'WOE.', 'DON.', 'VRI.', 'ZAT.']
    };

    LocaleConfig.defaultLocale = 'nl';
}
else if(lang=='pl'){
    LocaleConfig.locales['pl'] = {
        monthNames: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
        monthNamesShort: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
        dayNames: ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
        dayNamesShort: ['nie.', 'pon.', 'wto.', 'śro.', 'czw.', 'pią.', 'sob.']
    };

    LocaleConfig.defaultLocale = 'pl';
}
else if(lang=='pt'){
    LocaleConfig.locales['pt'] = {
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        dayNames: ['DOMIGO', 'SEGUNDA-FEIRA', 'TERÇA', 'QUARTA-FEIRA', 'QUINTA-FEIRA', 'SEXTA-FEIRA', 'SÁBADO'],
        dayNamesShort: ['DOM.', 'SEG.', 'TER.', 'QUAR.', 'QUIN.', 'SEX.', 'SÁB.']
    };

    LocaleConfig.defaultLocale = 'pt';
}
else if(lang=='ro'){
    LocaleConfig.locales['ro'] = {
        monthNames: ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'],
        monthNamesShort: ['ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'set', 'oct', 'noi', 'dec'],
        dayNames: ['Duminică', 'Luni', 'Marţi', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'],
        dayNamesShort: ['Dum.', 'Lun.', 'Mar.', 'Mie.', 'Joi.', 'Vin.', 'Sâm.']
    };

    LocaleConfig.defaultLocale = 'ro';
}
else if(lang=='ru'){
    LocaleConfig.locales['ru'] = {
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    };

    LocaleConfig.defaultLocale = 'ru';
}
else if(lang=='sv'){
    LocaleConfig.locales['sv'] = {
        monthNames: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
        dayNames: ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'],
        dayNamesShort: ['Sön.', 'Mån.', 'Tis.', 'Ons.', 'Tor.', 'Fre.', 'Lör.']
    };

    LocaleConfig.defaultLocale = 'sv';
}
else if(lang=='tr') {
    LocaleConfig.locales['tr'] = {
        monthNames: ['Ocak', 'şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        monthNamesShort: ['Oca', 'şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
        dayNames: ['Pazar', 'Pazartesi', 'Salı', 'çarşamba', 'Perşembe', 'Cumā', 'Cumartesi'],
        dayNamesShort: ['Paz.', 'Paz.', 'Sal.', 'çar.', 'Per.', 'Cum.', 'Cuma.']
    };

    LocaleConfig.defaultLocale = 'tr';
}
else if(lang=='vi') {
    LocaleConfig.locales['vi'] = {
        monthNames: ['Tháng một', 'Tháng hai', 'Tháng ba', 'Tháng tư', 'Tháng năm', 'Tháng sáu', 'Tháng bảy', 'Tháng tám', 'Tháng chín', 'Tháng mười', 'Tháng mười một', 'Tháng mười hai'],
        monthNamesShort: ['Tháng một', 'Tháng hai', 'Tháng ba', 'Tháng tư', 'Tháng năm', 'Tháng sáu', 'Tháng bảy', 'Tháng tám', 'Tháng chín', 'Tháng mười', 'Tháng mười một', 'Tháng mười hai'],
        dayNames: ['chủ nhật', 'thứ hai', 'thứ ba', 'thứ tư', 'thứ năm', 'thứ sáu', 'thứ bảy'],
        dayNamesShort: ['chủ nhật', 'thứ hai', 'thứ ba', 'thứ tư', 'thứ năm', 'thứ sáu', 'thứ bảy']
    };

    LocaleConfig.defaultLocale = 'vi';
}
else if(lang=='zh') {
    LocaleConfig.locales['zh'] = {
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月 ', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月 ', '八月', '九月', '十月', '十一月', '十二月'],
        dayNames: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    };

    LocaleConfig.defaultLocale = 'zh';
}
else {
    LocaleConfig.locales['en'] = {
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dayNames: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
        dayNamesShort: ['SUN.', 'MON.', 'TUE.', 'WED.', 'THUR.', 'FRI.', 'SAT.']
    };

    LocaleConfig.defaultLocale = 'en';
}

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
		this.state = {
			Data_Fat_date: '',
			myResult_Fat_date: '',
			Data_Chest_date: '',
			myResult_Chest_date: '',
			Data_Height_date: '',
			myResult_Height_date: '',
			Data_Arms_date: '',
			myResult_Arms_date: '',
			Data_Thigh_date: '',
			myResult_Thigh_date: '',
			Data_Waist_date: '',
			myResult_Waist_date: '',
			Data_Weight_date: '',
			myResult_Weight_date: '',
			loader: false,
			dataSource_weight: '',
			Data_Weight: '',
			myResult_weight: '',
			Weight_status: '',
			dataSource_Waist: '',
			Data_Waist: '',
			myResult_Waist: '',
			dataSource_Thigh: '',
			Data_Thigh: '',
			myResult_Thigh: '',
			dataSource_Arms: '',
			Data_Arms: '',
			myResult_Arms: '',
			dataSource_Height: '',
			Data_Height: '',
			myResult_Height: '',
			dataSource_Chest: '',
			Data_Chest: '',
			myResult_Chest: '',
			dataSource_Fat: '',
			Data_Fat: '',
			myResult_Fat: '',
			collapsed: false,
			two_collapsed: false,
			three_collapsed: false,
			four_collapsed: false,
			five_collapsed: false,
			six_collapsed: false,
			seven_collapsed: false,
		}
    
    }
    static navigationOptions = ({ navigation }) => {
        return {
          headerShown: false,
        };
    };
	toggleDrawer = ({ navigation }) => {
		this.props.navigation.toggleDrawer();
    };

	componentDidMount() {

		const { navigation } = this.props;
		this.setState({ loader: true })
		
		this.dashboardReport();
		this.dashboardReport_Waist();
		this.dashboardReport_Thigh();
		this.dashboardReport_Arms();
		this.dashboardReport_Height();
		this.dashboardReport_Chest();
		this.dashboardReport_Fat();

		this.focusListener = navigation.addListener("didFocus", () => {
            this.dashboardReport();
			this.dashboardReport_Waist();
			this.dashboardReport_Thigh();
			this.dashboardReport_Arms();
			this.dashboardReport_Height();
			this.dashboardReport_Chest();
			this.dashboardReport_Fat();
        });
        this.setState({ loader: false })
	}
	
	onRefresh() {
        this.dashboardReport();
		this.dashboardReport_Waist();
		this.dashboardReport_Thigh();
		this.dashboardReport_Arms();
		this.dashboardReport_Height();
		this.dashboardReport_Chest();
		this.dashboardReport_Fat();
	}

	// Weight Report Data
    
	async dashboardReport() {
		const Id = await AsyncStorage.getItem("id");
		// const report_type = await AsyncStorage.getItem("Weight");
        const Token = await AsyncStorage.getItem("access_token");

        const weightData = {
            "current_user_id": Id,
			"access_token": Token,
			"report_type" : "Weight",
		};
		
		dashboardReportAction(weightData).then(responseJson => {
			console.log(responseJson);
			this.setState({ loader: true });
            if (responseJson.status == 1) {
                this.setState({
					dataSource_weight: responseJson.result,
					Data_Weight_date: responseJson.result.date,
					Data_Weight: responseJson.result.value,	
					loader: false,
				});
            } else {
				this.setState({ loader: false });
			}
			var result_weight = this.state.Data_Weight;
			var myarray_weight = result_weight.split(',');
			var arrayOfNumbers = myarray_weight.map(Number);
			this.setState({ myResult_weight: arrayOfNumbers });

			let result_Weight_date = this.state.Data_Weight_date;
			let myarray_Weight_date = result_Weight_date.replace(/,/g, '      ');
			this.setState({ myResult_Weight_date: myarray_Weight_date });
			
		});
		
	}

	// Waist Report Data

	async dashboardReport_Waist() {
		const Id = await AsyncStorage.getItem("id");
		// const report_type = await AsyncStorage.getItem("Waist");
        const Token = await AsyncStorage.getItem("access_token");

        const WaistData = {
            "current_user_id": Id,
			"access_token": Token,
			"report_type" : "Waist",
		};
		dashboardReportWaistAction(WaistData).then(responseJson => {
            if (responseJson.status == 1) {
                this.setState({
					dataSource_Waist: responseJson.result,
					Data_Waist_date: responseJson.result.date,
					Data_Waist: responseJson.result.value,
					loader: false,
				});
            } else {
                this.setState({ loader: false });
			}
			var result_Waist = this.state.Data_Waist;
			var myarray_Waist = result_Waist.split(',');
			var arrayOfNumbers = myarray_Waist.map(Number);
			this.setState({ myResult_Waist: arrayOfNumbers });

			let result_Waist_date = this.state.Data_Waist_date;
			let myarray_Waist_date = result_Waist_date.replace(/,/g, '      ');
			this.setState({ myResult_Waist_date: myarray_Waist_date });

		});
		
	}

	// Thigh Report Data
    
	async dashboardReport_Thigh() {
		const Id = await AsyncStorage.getItem("id");
		// const report_type = await AsyncStorage.getItem("Thigh");
        const Token = await AsyncStorage.getItem("access_token");

        const ThighData = {
            "current_user_id": Id,
			"access_token": Token,
			"report_type" : "Thigh",
		};
		dashboardReportThighAction(ThighData).then(responseJson => {
            if (responseJson.status == 1) {
                this.setState({
					dataSource_Thigh: responseJson.result,
					Data_Thigh_date: responseJson.result.date,
					Data_Thigh: responseJson.result.value,
					loader: false,
				});
            } else {
                this.setState({ loader: false });
			}
			var result_Thigh = this.state.Data_Thigh;
			var myarray_Thigh = result_Thigh.split(',');
			var arrayOfNumbers = myarray_Thigh.map(Number);
			this.setState({ myResult_Thigh: arrayOfNumbers });
			
			let result_Thigh_date = this.state.Data_Thigh_date;
			let myarray_Thigh_date = result_Thigh_date.replace(/,/g, '      ');
			this.setState({ myResult_Thigh_date: myarray_Thigh_date });

		});
		
	}

	// Arms Report Data
    
	async dashboardReport_Arms() {
		const Id = await AsyncStorage.getItem("id");
		// const report_type = await AsyncStorage.getItem("Arms");
        const Token = await AsyncStorage.getItem("access_token");

        const ArmsData = {
            "current_user_id": Id,
			"access_token": Token,
			"report_type" : "Arms",
		};
		dashboardReportArmsAction(ArmsData).then(responseJson => {
            if (responseJson.status == 1) {
                this.setState({
					dataSource_Arms: responseJson.result,
					Data_Arms_date: responseJson.result.date,
					Data_Arms: responseJson.result.value,
					loader: false,
				});
            } else {
                this.setState({ loader: false });
			}
			var result_Arms = this.state.Data_Arms;
			var myarray_Arms = result_Arms.split(',');
			var arrayOfNumbers = myarray_Arms.map(Number);
			this.setState({ myResult_Arms: arrayOfNumbers });
			
			let result_Arms_date = this.state.Data_Arms_date;
			let myarray_Arms_date = result_Arms_date.replace(/,/g, '      ');
			this.setState({ myResult_Arms_date: myarray_Arms_date });

		});
		
	}

	// Height Report Data
    
	async dashboardReport_Height() {
		const Id = await AsyncStorage.getItem("id");
		// const report_type = await AsyncStorage.getItem("Height");
        const Token = await AsyncStorage.getItem("access_token");

        const HeightData = {
            "current_user_id": Id,
			"access_token": Token,
			"report_type" : "Height",
		};
		dashboardReportHeightAction(HeightData).then(responseJson => {
            if (responseJson.status == 1) {
                this.setState({
					dataSource_Height: responseJson.result,
					Data_Height_date: responseJson.result.date,
					Data_Height: responseJson.result.value,
					loader: false,
				});
            } else {
                this.setState({ loader: false });
			}
			var result_Height = this.state.Data_Height;
			var myarray_Height = result_Height.split(',');
			var arrayOfNumbers = myarray_Height.map(Number);
			this.setState({ myResult_Height: arrayOfNumbers });
			
			let result_Height_date = this.state.Data_Height_date;
			let myarray_Height_date = result_Height_date.replace(/,/g, '      ');
			this.setState({ myResult_Height_date: myarray_Height_date });

		});
		
	}

	// Chest Report Data
    
	async dashboardReport_Chest() {
		const Id = await AsyncStorage.getItem("id");
		// const report_type = await AsyncStorage.getItem("Chest");
        const Token = await AsyncStorage.getItem("access_token");

        const ChestData = {
            "current_user_id": Id,
			"access_token": Token,
			"report_type" : "Chest",
		};
		dashboardReportChestAction(ChestData).then(responseJson => {
            if (responseJson.status == 1) {
                this.setState({
					dataSource_Chest: responseJson.result,
					Data_Chest_date: responseJson.result.date,
					Data_Chest: responseJson.result.value,
					loader: false,
				});
            } else {
                this.setState({ loader: false });
			}
			var result_Chest = this.state.Data_Chest;
			var myarray_Chest = result_Chest.split(',');
			var arrayOfNumbers = myarray_Chest.map(Number);
			this.setState({ myResult_Chest: arrayOfNumbers });
			
			let result_Chest_date = this.state.Data_Chest_date;
			let myarray_Chest_date = result_Chest_date.replace(/,/g, '      ');
			this.setState({ myResult_Chest_date: myarray_Chest_date });

		});
		
	}

	// Fat Report Data
    
	async dashboardReport_Fat() {
		const Id = await AsyncStorage.getItem("id");
		// const report_type = await AsyncStorage.getItem("Fat");
        const Token = await AsyncStorage.getItem("access_token");

        const FatData = {
            "current_user_id": Id,
			"access_token": Token,
			"report_type" : "Fat",
		};
		dashboardReportFatAction(FatData).then(responseJson => {
            if (responseJson.status == 1) {
                this.setState({
					dataSource_Fat: responseJson.result,
					Data_Fat: responseJson.result.value,
					Data_Fat_date: responseJson.result.date,
					loader: false,
				});
            } else {
                this.setState({ loader: false });
			}
			var result_Fat = this.state.Data_Fat;
			var myarray_Fat = result_Fat.split(',');
			var arrayOfNumbers = myarray_Fat.map(Number);
			this.setState({ myResult_Fat : arrayOfNumbers });

			let result_Fat_date = this.state.Data_Fat_date;
			let myarray_Fat_date = result_Fat_date.replace(/,/g, '      ');
			this.setState({ myResult_Fat_date: myarray_Fat_date });

		});
		
	}

    render() {
		const { navigate } = this.props.navigation;
		const {  myResult_Weight_date , myResult_Waist_date , myResult_Thigh_date , myResult_Arms_date , myResult_Height_date , myResult_Chest_date , myResult_Fat_date , loader , dataSource_weight , myResult_weight , Data_Weight , dataSource_Waist , myResult_Waist , dataSource_Thigh , myResult_Thigh , dataSource_Arms , myResult_Arms , dataSource_Height , myResult_Height , dataSource_Chest , myResult_Chest , dataSource_Fat , myResult_Fat ,collapsed , two_collapsed , three_collapsed , four_collapsed , five_collapsed , six_collapsed , seven_collapsed	} = this.state;

	if (!loader) {
		return (
			<View style={styles.container}>
				<Row style={styles.NaveBar}>
                    <Col>
						<TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={styles.menu_col}>
							<Image style={styles.Naveicon}
								source={require('../../images/Menu-white.png')}
							/>
						</TouchableOpacity>
					</Col>
						
                        <Col style={{justifyContent: 'center', alignItems: 'center',width: normalize(240),paddingLeft: normalize(50)}}>
                            <Text style={styles.NaveText}>{t("Dashboard")}</Text>
                        </Col>
						
                        <Col>
                            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Workouts')} style={{backgroundColor: '',height: normalize(50), justifyContent: 'center', alignItems: 'center',width: normalize(50)}}>
								<Image style={styles.Naveicon}
									source={require('../../images/Workout-White.png')}
								/>
                            </TouchableOpacity>
                        </Col>
						<Col>
                            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Message')} style={{backgroundColor: '',height: normalize(50), justifyContent: 'center', alignItems: 'center',width: normalize(50)}}>
                            <Image style={styles.Naveicon}
								source={require('../../images/Message-white.png')}
                            />
                            </TouchableOpacity>
                        </Col>
                    </Row>
					<ScrollView showsVerticalScrollIndicator={false}
						refreshControl={
									<RefreshControl
										colors={["#102b46"]}
										refreshing={this.state.loader}
										onRefresh={this.onRefresh.bind(this)}
									/>
								}
					>
				
					<Row style={{height: 115,}}>
					
    					<TouchableOpacity onPress={()=> this.props.navigation.navigate('Workouts')} style={{width:"27%",backgroundColor: '#F1C40E',borderRadius: 5,justifyContent: 'center',alignItems: 'center',marginTop: '2%',marginBottom: '2%',marginRight: '5%', marginLeft: '5%',}}>
    						<Col style={{justifyContent: 'center',alignItems: 'center',}}>
    							<Row style={{height: 50 , alignItems: 'flex-end' ,}}>
									<Image style={{height: 35 , width: 35}}
										source={require('../../images/Workout-Blue-512.png')}
									/>
								</Row>
    							<Row>
									<Text style={{fontSize: 16, color: '#102B46', fontFamily:'Poppins-SemiBold',}}>{t("Workouts")}</Text>
								</Row>
							</Col>
    					</TouchableOpacity>
    					
    					<TouchableOpacity onPress={()=> this.props.navigation.navigate('Schedule')} style={{width:"27%",backgroundColor: '#F1C40E',borderRadius: 5,justifyContent: 'center',alignItems: 'center',marginBottom: '2%' ,marginTop: '2%', marginRight: '5%'}}>
    						<Col style={{justifyContent: 'center',alignItems: 'center'}}>
    							<Row style={{height: 50 , alignItems: 'flex-end' ,}}>
									<Image style={{height: 35 , width: 35}}
										source={require('../../images/Class-Schedule-Blue-512.png')}
									/>
									</Row>
								<Row style={{height: 20 }}>
									<Text style={{fontSize: 16, color: '#102B46', fontFamily:'Poppins-SemiBold',}}>{t("Class")}</Text>
								</Row>
								<Row>
									<Text style={{fontSize: 16, color: '#102B46', fontFamily:'Poppins-SemiBold',}}>{t("Schedule")}</Text>
								</Row>
    						</Col>
							
    					</TouchableOpacity>
    					
    					<TouchableOpacity onPress={()=> this.props.navigation.navigate('Nutritionplan')} style={{width:"27%",backgroundColor: '#F1C40E',borderRadius: 5,justifyContent: 'center',alignItems: 'center',marginBottom: '2%' ,marginTop: '2%',marginRight:"5%",}}>
    						<Col style={{justifyContent: 'center',alignItems: 'center',}}>
    							<Row style={{height: 50 , alignItems: 'flex-end' ,}}>
									<Image style={{height: 35 , width: 35}}
										source={require('../../images/Nutrition-Blue-512.png')}
									/>
								</Row>
								<Row style={{height: 20 }}>
    								<Text style={{fontSize: 16, color: '#102B46', fontFamily:'Poppins-SemiBold',}}>{t("Nutrition")}</Text>
								</Row>								
    							<Row>
									<Text style={{fontSize: 16, color: '#102B46', fontFamily:'Poppins-SemiBold',}}>{t("Plan")}</Text>
								</Row>
							</Col>
    					</TouchableOpacity>
					
					</Row>
    					<Calendar
							monthFormat={'MMMM, yyyy'}
                            theme={{
                                    textSectionTitleColor: '#b6c1cd',
                                    textSectionTitleDisabledColor: '#102b46',
                                    selectedDayTextColor: '#ffffff',
                                    todayTextColor: '#00adf5',
                                    dayTextColor: '#2d4150',
                                    textDisabledColor: '#d9e1e8',
                                    dotColor: '#00adf5',
                                    selectedDotColor: '#ffffff',
                                    arrowColor: '#102b46',
                                    disabledArrowColor: '#d9e1e8',
                                    monthTextColor: '#102b46',
                                    indicatorColor: '#102b46',
                                    textDayFontFamily: 'Poppins-Medium',
                                    textMonthFontFamily:'Poppins-SemiBold',
                                    textDayHeaderFontFamily: 'Poppins-Medium',
                                    textDayFontSize: 13,
                                    textMonthFontSize: 17,
                                    textDayHeaderFontSize: 13
								}}
							markedDates={{	
								[today]: { selected: true, selectedColor: '#102b46' , selectedborderColor: 'yellow', selectedborderWidth: 1,},
							}}
					/>
				<Col style={{borderWidth: 1, borderColor: '#102b46',borderRadius:5,marginLeft: '5%', marginRight: '5%',marginBottom: '5%',}}>
					<Collapse
					isCollapsed={this.state.collapsed}
					onToggle={(isCollapsed) => this.setState({ collapsed: !this.state.collapsed })}>
						{(collapsed == true) ?(<CollapseHeader>
							<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
									<Col style={{width: '90%',}}>
										<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
										color:'#ffffff',}}>{t("Weight Progress Report")}</Text>
									</Col>
									<Col style={{width: '10%',}}>		
										<Image style={{height: 18, width: 18,}}
										source={require('../../images/down-arrow.png')}/>
									</Col>
							</Row>
					  </CollapseHeader>):(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
									color:'#ffffff',}}>{t("Weight Progress Report")}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../images/right-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>)}

					<CollapseBody> 
						{( dataSource_weight != 0 )?(
							<ScrollView
								height={250}
								horizontal={true}
								contentOffset={{ x: 0, y: 0 }} // i needed the scrolling to start from the end not the start
								showsHorizontalScrollIndicator={false} // to hide scroll bar
							>
						<CollapseBody style={{backgroundColor: '#102B46',paddingBottom: '5%',borderTopWidth: 1, borderColor: '#fff', paddingTop:'5%' ,}}>
						
						<Row>
							<Col style={{justifyContent: 'center' ,alignItems:'center',width: normalize(25)}}>
								<Text style={styles.label}>{dataSource_weight.measurment_unit}</Text>
							</Col>
								<LineChart
								data={{
								  labels: [myResult_Weight_date],
								  datasets: [
									{
									  data: myResult_weight
									}
								  ]
								}}
								// width={900}
								withOuterLines = {
								true
								}
								// width={Dimensions.get("window").width-38} // from react-native
								width={normalize(650)}
								height={185}
								verticalLabelRotation={-0.1}
								yAxisInterval={1} // optional, defaults to 1
								chartConfig={{	
									backgroundColor: "#102B46",
									backgroundGradientFrom: "#102B46",
									backgroundGradientTo: "#102B46",
									//   decimalPlaces: 1, // optional, defaults to 2dp
									color: (opacity = 0) => `rgb( 130, 121, 47,${opacity})`,
									labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
										propsForDots: {
											r: "0",
											strokeWidth: '0'
										},
										propsForBackgroundLines: {
											strokeWidth: 0,
										}
									}}
									svg={{
										stroke: 'rgb(134, 65, 244)',
									}}
									bezier
									labelStyle={{
											color: 'grey',
											transform:[{ rotateX: '100deg'}],
										}}
									propsForLabels={{
										fontFamily:'Poppins-Bold',
									}}
									style={{
										paddingLeft: 10,
										paddingBottom: 10,
								}}
							  />
							
						</Row>
						</CollapseBody></ScrollView>):(
						<View style={{ borderTopWidth: 1, borderColor: '#fff',}}>
							<Row style={{ justifyContent: 'center', alignItems: 'center',height: 170, backgroundColor: '#102B46',}}>  
								<Text style={{ fontSize: 20, color: '#fff' }}>{t("Record not available")}</Text>
							</Row>
						</View>)}
					</CollapseBody>	
					</Collapse>
				</Col>
			
				<Col style={{borderWidth: 1, borderColor: '#102b46',borderRadius:5,marginLeft: '5%', marginRight: '5%',marginBottom: '5%',}}>
					<Collapse
					isCollapsed={this.state.two_collapsed}
					onToggle={(isCollapsed) => this.setState({ two_collapsed: !this.state.two_collapsed })}>
						{(two_collapsed == true) ?(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
									color:'#ffffff',}}>{t("Waist Progress Report")}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../images/down-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>):(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
									color:'#ffffff',}}>{t("Waist Progress Report")}</Text>
								</Col>
								<Col style={{width: '10%',}}>
									<Image style={{height: 18, width: 18,}}
									source={require('../../images/right-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>)}
					  	<CollapseBody>
						{( dataSource_Waist != 0 )?(
						<ScrollView
						height={250}
						horizontal={true}
						contentOffset={{ x: 0, y: 0 }} // i needed the scrolling to start from the end not the start
						showsHorizontalScrollIndicator={false} // to hide scroll bar
					>
						<CollapseBody style={{backgroundColor: '#102B46',paddingBottom: '5%',borderTopWidth: 1, borderColor: '#fff', paddingTop:'5%' ,}}>
						<Row>
							<Col style={{justifyContent: 'center' ,alignItems:'center',width: normalize(25)}}>
								<Text style={styles.label}>{dataSource_Waist.measurment_unit}</Text>
							</Col>
								<LineChart
								data={{
								  labels: [myResult_Waist_date],
								  datasets: [
									{
									  data: myResult_Waist
									}
								  ]
								}}
								withOuterLines = {
									true
									}
									verticalLabelRotation={-0.1}
									// width={Dimensions.get("window").width-38} // from react-native
									width={normalize(650)}
									height={185}
									
									// yAxisInterval={1} // optional, defaults to 1
									chartConfig={{	
										backgroundColor: "#102B46",
										backgroundGradientFrom: "#102B46",
										backgroundGradientTo: "#102B46",
										//   decimalPlaces: 1, // optional, defaults to 2dp
										color: (opacity = 0) => `rgb( 130, 121, 47,${opacity})`,
										labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
											propsForDots: {
												r: "0",
												strokeWidth: '0'
											},
											propsForBackgroundLines: {
												strokeWidth: 0,
											}
										}}
										svg={{
											stroke: 'rgb(134, 65, 244)',
											strokeWidth: 2,
										}}
										bezier
										style={{
											paddingLeft: 10,
											paddingBottom: 10,
									}}
							  />
						</Row></CollapseBody></ScrollView>):(
						<View style={{ borderTopWidth: 1, borderColor: '#fff',}}>
							<Row style={{ justifyContent: 'center', alignItems: 'center',height: 170, backgroundColor: '#102B46',}}>  
								<Text style={{ fontSize: 20, color: '#fff' }}>{t("Record not available")}</Text>
							</Row>
						</View>)}
					</CollapseBody>	
					</Collapse>
				</Col>
				
				<Col style={{borderWidth: 1, borderColor: '#102b46',borderRadius:5,marginLeft: '5%', marginRight: '5%',marginBottom: '5%',}}>
					<Collapse
					isCollapsed={this.state.three_collapsed}
					onToggle={(isCollapsed) => this.setState({ three_collapsed: !this.state.three_collapsed })}>
						{(three_collapsed == true) ?(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
									color:'#ffffff',}}>{t("Thigh Progress Report")}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../images/down-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>):(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
									color:'#ffffff',}}>{t("Thigh Progress Report")}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../images/right-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>)}
					  
					  <CollapseBody>
						{( dataSource_Thigh != 0 )?(
						<ScrollView
						height={250}
						horizontal={true}
						contentOffset={{ x: 0, y: 0 }} // i needed the scrolling to start from the end not the start
						showsHorizontalScrollIndicator={false} // to hide scroll bar
					>
						<CollapseBody style={{backgroundColor: '#102B46',paddingBottom: '5%',borderTopWidth: 1, borderColor: '#fff', paddingTop:'5%' ,}}>
						<Row>
							<Col style={{justifyContent: 'center' ,alignItems:'center',width: normalize(25)}}>
								<Text style={styles.label}>{dataSource_Thigh.measurment_unit}</Text>
							</Col>
								<LineChart
								data={{
								  labels: [myResult_Thigh_date],
								  datasets: [
									{
									  data: myResult_Thigh
									}
								  ]
								}}
								withOuterLines = {
									true
									}
									verticalLabelRotation={-0.1}
									// width={Dimensions.get("window").width-38} // from react-native
									width={normalize(650)}
									height={185}
									
									// yAxisInterval={1} // optional, defaults to 1
									chartConfig={{	
										backgroundColor: "#102B46",
										backgroundGradientFrom: "#102B46",
										backgroundGradientTo: "#102B46",
										//   decimalPlaces: 1, // optional, defaults to 2dp
										color: (opacity = 0) => `rgb( 130, 121, 47,${opacity})`,
										labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
											propsForDots: {
												r: "0",
												strokeWidth: '0'
											},
											propsForBackgroundLines: {
												strokeWidth: 0,
											}
										}}
										svg={{
											stroke: 'rgb(134, 65, 244)',
											strokeWidth: 2,
										}}
										bezier
										style={{
											paddingLeft: 10,
											paddingBottom: 10,
									}}
							  />
						</Row></CollapseBody></ScrollView>):(
						<View style={{ borderTopWidth: 1, borderColor: '#fff',}}>
							<Row style={{ justifyContent: 'center', alignItems: 'center',height: 170, backgroundColor: '#102B46',}}>  
								<Text style={{ fontSize: 20, color: '#fff' }}>{t("Record not available")}</Text>
							</Row>
						</View>)}
					</CollapseBody>	
					</Collapse>
				</Col>
				
				<Col style={{borderWidth: 1, borderColor: '#102b46',borderRadius:5,marginLeft: '5%', marginRight: '5%',marginBottom: '5%',}}>
					<Collapse
					isCollapsed={this.state.four_collapsed}
					onToggle={(isCollapsed) => this.setState({ four_collapsed: !this.state.four_collapsed })}>
						{(four_collapsed == true) ?(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
									color:'#ffffff',}}>{t("Arms Progress Report")}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../images/down-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>):(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
									color:'#ffffff',}}>{t("Arms Progress Report")}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../images/right-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>)}
					  
					  <CollapseBody>
						{( dataSource_Arms != 0 )?(
						<ScrollView
						height={250}
						horizontal={true}
						contentOffset={{ x: 0, y: 0 }} // i needed the scrolling to start from the end not the start
						showsHorizontalScrollIndicator={false} // to hide scroll bar
					>
						<CollapseBody style={{backgroundColor: '#102B46',paddingRight: '50%',paddingBottom: '5%',borderTopWidth: 1, borderColor: '#fff', paddingTop:'5%' ,}}>
						<Row>
							<Col style={{justifyContent: 'center' ,alignItems:'center',width: normalize(25)}}>
								<Text style={styles.label}>{dataSource_Arms.measurment_unit}</Text>
							</Col>
								<LineChart
								data={{
								  labels: [myResult_Arms_date],
								  datasets: [
									{
									  data: myResult_Arms
									}
								  ]
								}}
								withOuterLines = {
									true
									}
									verticalLabelRotation={-0.1}
									// width={Dimensions.get("window").width-38} // from react-native
									width={normalize(650)}
									height={185}
									
									// yAxisInterval={1} // optional, defaults to 1
									chartConfig={{	
										backgroundColor: "#102B46",
										backgroundGradientFrom: "#102B46",
										backgroundGradientTo: "#102B46",
										//   decimalPlaces: 1, // optional, defaults to 2dp
										color: (opacity = 0) => `rgb( 130, 121, 47,${opacity})`,
										labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
											propsForDots: {
												r: "0",
												strokeWidth: '0'
											},
											propsForBackgroundLines: {
												strokeWidth: 0,
											}
										}}
										svg={{
											stroke: 'rgb(134, 65, 244)',
											strokeWidth: 2,
										}}
										bezier
										style={{
											paddingLeft: 10,
											paddingBottom: 10,
									}}
							  />
						</Row></CollapseBody></ScrollView>):(
						<View style={{ borderTopWidth: 1, borderColor: '#fff',}}>
							<Row style={{ justifyContent: 'center', alignItems: 'center',height: 170, backgroundColor: '#102B46',}}>  
								<Text style={{ fontSize: 20, color: '#fff' }}>{t("Record not available")}</Text>
							</Row>
						</View>)}
					</CollapseBody>	
					</Collapse>
				</Col>
				
				<Col style={{borderWidth: 1, borderColor: '#102b46',borderRadius:5,marginLeft: '5%', marginRight: '5%',marginBottom: '5%',}}>
					<Collapse
					isCollapsed={this.state.five_collapsed}
					onToggle={(isCollapsed) => this.setState({ five_collapsed: !this.state.five_collapsed })}>
						{(five_collapsed == true) ?(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
									color:'#ffffff',}}>{t("Height Progress Report")}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../images/down-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>):(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
									color:'#ffffff',}}>{t("Height Progress Report")}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../images/right-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>)}
					  
					  <CollapseBody>
						{( dataSource_Height != 0 )?(
						<ScrollView
						height={250}
						horizontal={true}
						contentOffset={{ x: 0, y: 0 }} // i needed the scrolling to start from the end not the start
						showsHorizontalScrollIndicator={false} // to hide scroll bar
					>
						<CollapseBody style={{backgroundColor: '#102B46',paddingBottom: '5%',borderTopWidth: 1, borderColor: '#fff', paddingTop:'5%' ,}}>
						<Row>
							<Col style={{justifyContent: 'center' ,alignItems:'center',width: normalize(25)}}>
								<Text style={styles.label}>{dataSource_Height.measurment_unit}</Text>
							</Col>
								<LineChart
								data={{
								  labels: [myResult_Height_date],
								  datasets: [
									{
									  data: myResult_Height
									}
								  ]
								}}
								withOuterLines = {
									true
									}
									verticalLabelRotation={-0.1}
									// width={Dimensions.get("window").width-38} // from react-native
									width={normalize(650)}
									height={185}
									
									// yAxisInterval={1} // optional, defaults to 1
									chartConfig={{	
										backgroundColor: "#102B46",
										backgroundGradientFrom: "#102B46",
										backgroundGradientTo: "#102B46",
										//   decimalPlaces: 1, // optional, defaults to 2dp
										color: (opacity = 0) => `rgb( 130, 121, 47,${opacity})`,
										labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
											propsForDots: {
												r: "0",
												strokeWidth: '0'
											},
											propsForBackgroundLines: {
												strokeWidth: 0,
											}
										}}
										svg={{
											stroke: 'rgb(134, 65, 244)',
											strokeWidth: 2,
										}}
										bezier
										style={{
											paddingLeft: 10,
											paddingBottom: 10,
									}}
							  />
						</Row></CollapseBody></ScrollView>):(
						<View style={{ borderTopWidth: 1, borderColor: '#fff',}}>
							<Row style={{ justifyContent: 'center', alignItems: 'center',height: 170, backgroundColor: '#102B46',}}>  
								<Text style={{ fontSize: 20, color: '#fff' }}>{t("Record not available")}</Text>
							</Row>
						</View>)}
					</CollapseBody>	
					</Collapse>
				</Col>
				
				<Col style={{borderWidth: 1, borderColor: '#102b46',borderRadius:5,marginLeft: '5%', marginRight: '5%',marginBottom: '5%',}}>
					<Collapse
					isCollapsed={this.state.six_collapsed}
					onToggle={(isCollapsed) => this.setState({ six_collapsed: !this.state.six_collapsed })}>
						{(six_collapsed == true) ?(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
									color:'#ffffff',}}>{t("Chest Progress Report")}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../images/down-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>):(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
									color:'#ffffff',}}>{t("Chest Progress Report")}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../images/right-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>)}
					  
					  <CollapseBody>
						{( dataSource_Chest != 0 )?(
						<ScrollView
						height={250}
						horizontal={true}
						contentOffset={{ x: 0, y: 0 }} // i needed the scrolling to start from the end not the start
						showsHorizontalScrollIndicator={false} // to hide scroll bar
					>
						<CollapseBody style={{backgroundColor: '#102B46',paddingBottom: '5%',borderTopWidth: 1, borderColor: '#fff', paddingTop:'5%' ,}}>
						<Row>
							<Col style={{justifyContent: 'center' ,alignItems:'center',width: normalize(25)}}>
								<Text style={styles.label}>{dataSource_Chest.measurment_unit}</Text>
							</Col>
								<LineChart
								data={{
								  labels: [myResult_Chest_date],
								  datasets: [
									{
									  data: myResult_Chest
									}
								  ]
								}}
								withOuterLines = {
									true
									}
									verticalLabelRotation={-0.1}
									// width={Dimensions.get("window").width-38} // from react-native
									width={normalize(650)}
									height={185}
									
									// yAxisInterval={1} // optional, defaults to 1
									chartConfig={{	
										backgroundColor: "#102B46",
										backgroundGradientFrom: "#102B46",
										backgroundGradientTo: "#102B46",
										//   decimalPlaces: 1, // optional, defaults to 2dp
										color: (opacity = 0) => `rgb( 130, 121, 47,${opacity})`,
										labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
											propsForDots: {
												r: "0",
												strokeWidth: '0'
											},
											propsForBackgroundLines: {
												strokeWidth: 0,
											}
										}}
										svg={{
											stroke: 'rgb(134, 65, 244)',
											strokeWidth: 2,
										}}
										bezier
										style={{
											paddingLeft: 10,
											paddingBottom: 10,
									}}
							  />
						</Row></CollapseBody></ScrollView>):(
						<View style={{ borderTopWidth: 1, borderColor: '#fff',}}>
							<Row style={{ justifyContent: 'center', alignItems: 'center',height: 170, backgroundColor: '#102B46',}}>  
								<Text style={{ fontSize: 20, color: '#fff' }}>{t("Record not available")}</Text>
							</Row>
						</View>)}
					</CollapseBody>	
					</Collapse>
				</Col>
				
				<Col style={{borderWidth: 1, borderColor: '#102b46',borderRadius:5,marginLeft: '5%', marginRight: '5%',marginBottom: '5%',}}>
					<Collapse
					isCollapsed={this.state.seven_collapsed}
					onToggle={(isCollapsed) => this.setState({ seven_collapsed: !this.state.seven_collapsed })}>
						{(seven_collapsed == true) ?(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
									color:'#ffffff',}}>{t("Fat Progress Report")}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../images/down-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>):(<CollapseHeader>
						<Row style={{paddingLeft: '5%',height: 45,backgroundColor: '#102b46',justifyContent: 'center', alignItems: 'center',}}>
								<Col style={{width: '90%',}}>
									<Text style={{fontSize: 17,fontFamily:'Poppins-SemiBold',
									color:'#ffffff',}}>{t("Fat Progress Report")}</Text>
								</Col>
								<Col style={{width: '10%',}}>		
									<Image style={{height: 18, width: 18,}}
									source={require('../../images/right-arrow.png')}/>
								</Col>
						</Row>
					  </CollapseHeader>)}
					  <CollapseBody>
						{( dataSource_Fat != 0 )?(
						<ScrollView
						height={250}
						horizontal={true}
						contentOffset={{ x: 0, y: 0 }} // i needed the scrolling to start from the end not the start
						showsHorizontalScrollIndicator={false} // to hide scroll bar
					>
						<CollapseBody style={{backgroundColor: '#102B46',paddingBottom: '5%',borderTopWidth: 1, borderColor: '#fff', paddingTop:'5%' ,}}>
						<Row>
							<Col style={{justifyContent: 'center' ,alignItems:'center',width: normalize(25)}}>
								<Text style={styles.label}>{dataSource_Fat.measurment_unit}</Text>
							</Col>
								<LineChart
								data={{
								  labels: [myResult_Fat_date],
								  datasets: [
									{
									  data: myResult_Fat
									}
								  ]
								}}
								withOuterLines = {
									true
									}
									verticalLabelRotation={-0.1}
									// width={Dimensions.get("window").width-38} // from react-native
									width={normalize(650)}
									height={185}
									// yAxisInterval={1} // optional, defaults to 1
									chartConfig={{	
										backgroundColor: "#102B46",
										backgroundGradientFrom: "#102B46",
										backgroundGradientTo: "#102B46",
										//   decimalPlaces: 1, // optional, defaults to 2dp
										color: (opacity = 0) => `rgb( 130, 121, 47,${opacity})`,
										labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
											propsForDots: {
												r: "0",
												strokeWidth: '0'
											},
											propsForBackgroundLines: {
												strokeWidth: 0,
											}
										}}
										svg={{
											stroke: 'rgb(134, 65, 244)',
											strokeWidth: 2,
										}}
										bezier
										style={{
											paddingLeft: 10,
											paddingBottom: 10,
									}}
							  />
						</Row></CollapseBody></ScrollView>):(
						<View style={{ borderTopWidth: 1, borderColor: '#fff',}}>
							<Row style={{ justifyContent: 'center', alignItems: 'center',height: 170, backgroundColor: '#102B46',}}>  
								<Text style={{ fontSize: 20, color: '#fff' }}>{t("Record not available")}</Text>
							</Row>
						</View>)}
					</CollapseBody>	
					</Collapse>
				</Col>
				
				</ScrollView>
				<DropdownAlert ref={ref => (this.dropdown = ref)}/>
			</View>

			);
		} else {
            return (
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                    color="#102b46"
                />
            );
        }
    }
}
const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({

    container:
    { 
		flex: 1,
		backgroundColor: '#ffffff',
	},
	label:{
		transform: [{ rotate: '270deg'}],
		fontSize: 15,
		color: 'white',
		width: normalize(90),
		fontFamily:'Poppins-Medium',
	},
	loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
	},
	loader: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
		justifyContent: "center",
		color: "#102b46",
    },
    bg_image:
    {
        // flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    NaveBar: {
        ...Platform.select({
            ios:{
                height: normalize(75),
				backgroundColor: '#102b46',
				justifyContent: 'center',
				alignItems: 'center',
				paddingTop: normalize(25)
            }, 
            android:{
                height: normalize(50),
				backgroundColor: '#102b46',
				justifyContent: 'center',
				alignItems: 'center',
            }})
        
    },
    NaveCol: {
        justifyContent: 'center',
        alignItems:'center',
    },
    NaveText: {
        color: '#fff',
        fontSize: 18, 
		fontFamily:'Poppins-Regular',
        textAlign: 'center',
    },
    text:
    {
        color: '#fff',
        fontSize: 16,
        opacity: 0.5,
    },
    Naveicon:
    {
        height: normalize(24),
        width: normalize(24),
	},
	menu_col: {
		...Platform.select({
			ios: {
				width: normalize(70),
				height: normalize(50),
				justifyContent: 'center',
				alignItems: 'center',
			},
			android: {
				width: normalize(70),
				height: normalize(50),
				justifyContent: 'center',
				alignItems: 'center',	
			},
		})
	},
})



