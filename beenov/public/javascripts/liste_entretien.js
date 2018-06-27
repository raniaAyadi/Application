function getListeEntretien(){
  $.ajax(
{ /* requète GET pour récupérer infos entretiens */
    type: "GET",
    url : "get_meeting_list",
    dataType: "json",
    success : function(data)
    {
  /* Création tableau avec paramètres */
  var tableau = $('#meetings').DataTable(
      {
    "data" : set_data(data),
    "columns": [
        { title: "Thématique" },
        { title: "SIRET" },
        { title: "Entreprise" },
        { title: "Code NAF" },
        { title: "Secteur d'activité" },
        { title: "Effectif" },
        { title: "Conseiller" },
        { type: "date", title: "Date"},
        { visible : false, searchable : false},
        { visible : false, searchable : false} ],
    "scrollY":	"58vh",
    "scrollX":	true,
    "paging":	false,
    "bFilter":	false,
    "searching":	true,
    "dom":		't',
    "select" :	'single'
      });
    }
  });
}
