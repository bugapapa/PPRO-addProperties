//==========[[ INFO-PANEL ]]===============================================================

// 1. KÓD:  Megvizsgálja hogy a kiválasztott clip-en megtalálható-e a megadott effekt
//          Ha igen, csak a beállításokat módosítja
//          Paraméterek beállítása az 68.-ik sornál kezdődnek

// 2. KÓD:  Ha az első kód lefut és nem találta a megadott effektet a kiválasztott clip-en,
//          akkor bemegy a 2. kódba, megkeresi a kiválasztott clip-et, rárakja az effektet,
//          majd a paraméter beállításokat is!
//          Paraméterek beállítása az 170.-ik sornál kezdődnek

//==========[[ INFO-PANEL ]]===============================================================


app.enableQE();

var effect = "Crop";

var qeProject = qe.project;
var qeSequence = qeProject.getSequenceAt(0);
var qeClip;
var qeTrack_1;

var videoTracks = app.project.activeSequence.videoTracks;

var hasEffect = false;
var clipComponent;

//=====================================================================================================
//  1. Kód = Loop
//=====================================================================================================
for (var i = 0; i < videoTracks.numTracks; i++) {
    // $.writeln(qeSequence.getVideoTrackAt(i).name);
    qeTrack_1 = qeSequence.getVideoTrackAt(i);

    for (var j = 0; j < qeTrack_1.numItems; j++) {

        if (qeTrack_1.getItemAt(j).type.toString() != "Empty") {

            // Ha a "hasEffect" false, akkor lépjen be ebbe a kódba, ha true, akkor a loop addig fut amíg végig nem ér az elemeken, majd kilép 
            // (a 2. kód nem fut le ha "hasEffect" = true)
            if (hasEffect == false && clip_is_selected(qeTrack_1.getItemAt(j), i)) {

                qeClip = qeTrack_1.getItemAt(j);
                // Ez a loop végig megy a clip komponensein
                for (var k = 0; k < qeClip.numComponents; k++) {

                    // Ha a componens "[k]".-adik elemének a neve megyegyezik a megadott effekt-tel, akkor ez a kód fusson le
                    if (qeClip.getComponentAt(k).name == effect) {

                        // component name test
                        // $.writeln(qeClip.getComponentAt(i).name);

                        // A "hasEffect"-et "true"-ra állítjuk, hogy a loop-on kívüli a 2.-es kód ne fusson le
                        hasEffect = true;

                        // Kell egy elágazás hogy megvizsgáljuk a track clipje nem-e "null", külömben hibát ír a script és nem fut tovább
                        if (qeClip.getComponentAt(k) != null) {

                            // Létrehozunk egy "clipComponent" nevű változót, amiben az "[i]".-edik track-nek az "[j]".-edik clip-jét tároljuk, hogy a clip.properties-t megtudjuk hívni
                            clipComponent = qeClip.getComponentAt(k);
                            // $.writeln(clipComponent.name);

                            var propertie = get_properties(clipComponent.name, qeClip.name);

                            // Ide jönnek a paraméter beállítások !
                            // =====================================================================================================
                            propertie[0].setValue(40, 1);
                            



                            
                            // =====================================================================================================

                            // component name test
                            // $.writeln(clipComponent.properties[0].displayName);

                            // Lépjen ki k.-adik loopból, többször már nem fog ide belépni, mert a "hasEffect" true-ra lett állítva, így a 2-es kód se fog lefutni
                            break;

                        }
                    }
                }
            }
        }
    }
}

// Ez a function megvizsgálja hogy a clip kivan-e választva, ha igen akkor egy "true"-t ad vissza paraméternek, ha nem "false"-t
function clip_is_selected(qeClip, trackIndex) {

    for (var v1 = 0; v1 < app.project.activeSequence.videoTracks[trackIndex].clips.numItems; v1++) {
        if (app.project.activeSequence.videoTracks[trackIndex].clips[v1].name == qeClip.name) {
            if (app.project.activeSequence.videoTracks[trackIndex].clips[v1].isSelected()) {
                return true;
            }
        }
    }
    return false;
}

// Ez a funckió a megadott componens nevét és a clip nevét megkeresi és vissza adja a clip beállításait
function get_properties(qeCompName, clipName) {

    for (var v3 = 0; v3 < videoTracks.numTracks; v3++) {
        for (var v4 = 0; v4 < videoTracks[v3].clips.numItems; v4++) {
            for (var v5 = 0; v5 < videoTracks[v3].clips[v4].components.numItems; v5++) {
                if(videoTracks[v3].clips[v4].components[v5].displayName == qeCompName && videoTracks[v3].clips[v4].name == clipName){
                    return videoTracks[v3].clips[v4].components[v5].properties;
                }
            }
        }
    }
}


//=====================================================================================================
//  2. Kód = AddEffect
//=====================================================================================================
if (!hasEffect) {
    // A script belépett ebbe a kódba, mivel a "hasEffect" továbbra is false maradt

    // hasEffect test
    // $.writeln(hasEffect);

    var qeTrack;

    // Végig megyünk a track elemeken
    for (var c1 = 0; c1 < videoTracks.numTracks; c1++) {

        // Beállítunk egy kilépési pontot, ha false a track loop megy tovább, ha true kilép az egész loop-ból
        var exitLoop = false;

        qeTrack = qeSequence.getVideoTrackAt(c1);

        // Végig megyünk a track itemeken(clips)
        for (var c2 = 0; c2 < qeTrack.numItems; c2++) {

            // Ha a clipp nem null
            if (qeTrack.getItemAt(c2) != null) {

                // Ha a clip típusa nem "Empty"
                if (qeTrack.getItemAt(c2).type.toString() != "Empty") {

                    // Ha a clip ki van választva
                    if (clip_is_selected(qeTrack.getItemAt(c2), c1)) {

                        // Ha az összes feltétel igaz, akkor a kilépési pontot aktiváljuk és kilépünk a loop-ból
                        exitLoop = true;

                        // Hozzáadjuk a clip-hez a megadott "effect"-et
                        qeClip = qeSequence.getVideoTrackAt(c1).getItemAt(c2);
                        qeClip.addVideoEffect(qe.project.getVideoEffectByName(effect));

                        // Beletesszük az összes componenst egy változóba
                        var components = app.project.activeSequence.videoTracks[c1].clips[c2].components;

                        // Végig megyünk a componenseken
                        for (var c3 = 0; c3 < components.numItems; c3++) {

                            // Ha megtalálta az effect-et...
                            if (components[c3].displayName == effect) {

                                // Egy változóba tesszük az összes beállítást
                                var propertie = components[c3].properties;

                                // Ide jönnek a paraméter beállítások !
                                // =====================================================================================================
                                propertie[0].setValue(0, 1);
                                
                                
                                
                                // =====================================================================================================

                                // Kilépünk a loop-ból, ha csak az első effecten akarunk változtatni
                                break;
                            }
                        }

                        // qeClip & clip test
                        // $.writeln(app.project.sequences[0].videoTracks[c1].clips[c2].name + ", " + qeClip.type);

                        break;

                    }
                }
            }
        }

        // Ha a kilépési pont true, akkor kilép az egész loop-ból
        if (exitLoop) break;

    }
}