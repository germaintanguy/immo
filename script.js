
document.addEventListener("DOMContentLoaded", function () {
   
    const annee_max = 30
    const y_label = [`Année 0`]
    const x_axis =[]



    // Sélection des éléments du DOM
    const inputs = {
        prixTotalProjet: document.getElementById('recap-prix-total'),
        prixTotalProjetHover: document.getElementById('recap-prix-total-hover'),
        prixLogement: document.getElementById('prix-logement'),
        travaux: document.getElementById('travaux'),
        meubles: document.getElementById('meubles'),
        apport: document.getElementById('apport'),
        taxeFonciere: document.getElementById('taxe-fonciere'),
        fraisNotaire: document.getElementById('frais-notaire'),
        fraisAgence: document.getElementById('frais-agence'),
        gestionAgence: document.getElementById('gestion-agence'),
        tauxTom: document.getElementById('taux-tom'),
        tomCalcule: document.getElementById('tom-calcule'),
        trancheImpot: document.getElementById('tranche-impot'),
        montantEmprunte: document.getElementById('montant-emprunte'),
        dureePret: document.getElementById('duree-pret'),
        tauxInterets: document.getElementById('taux-interets'),
        tauxAssurance: document.getElementById('taux-assurance'),
        garantiesBancaires: document.getElementById('garanties-bancaires'),
        fraisDossier: document.getElementById('frais-dossier'),
        fraisCourtier: document.getElementById('frais-courtier'),
        loyerHorsCharges: document.getElementById('loyer-hors-charges'),
        chargesLocatives: document.getElementById('charges-locatives'),
        chargesCopropriete: document.getElementById('charges-copropriete'),
        assuranceLoyers: document.getElementById('assurance-loyers'),
        assurancePno: document.getElementById('assurance-pno'),
        coutComptable: document.getElementById('cout-comptable'),
        recapAnneeBody: document.getElementById('recap-annee-body'),
        recapPlBody: document.getElementById('recap-pl-body'),
        recapCreditBody: document.getElementById('recap-credit-body'),
        recapImpotBody: document.getElementById('recap-impot-body'), 
        recapImpotHover: document.getElementById('recap-impot-hover'),
        recapLoyer: document.getElementById('recap-loyer'),
        recapTotalCharges: document.getElementById('recap-total-charges'),
        recapTotalChargesHover: document.getElementById('recap-total-charges-hover'),
        recapCashflow: document.getElementById('recap-cashflow'),
        recapRendementBrut: document.getElementById('recap-rendement-brut'),
        recapRendementNet: document.getElementById('recap-rendement-net'),
        recapRendementNetHover: document.getElementById('recap-rendement-net-hover'),

    };

    function getFloat(element) {
        return parseFloat(element.value) || 0;
    };


    function calculerTom() {
        const taxeFonciere = getFloat(inputs.taxeFonciere);
        const tauxTom = getFloat(inputs.tauxTom) / 100;
        const tom = taxeFonciere * tauxTom;
        inputs.tomCalcule.value = tom.toFixed(2);
    }


    function calculerMontantEmprunte() {
        const apport = getFloat(inputs.apport);
        const prixLogement = getFloat(inputs.prixLogement);
        const travaux = getFloat(inputs.travaux);
        const meubles = getFloat(inputs.meubles);
        const fraisNotaire = getFloat(inputs.fraisNotaire);
        const fraisAgence = getFloat(inputs.fraisAgence);
        const garantieBancaires = getFloat(inputs.garantiesBancaires);
        const fraisDossier = getFloat(inputs.fraisDossier);
        const fraisCourtier = getFloat(inputs.fraisCourtier);
        const montantTotal = {
            description: `prixLogement + travaux + meubles + fraisNotaire + garantieBancaires + fraisDossier + fraisCourtier + fraisAgence`,
            value: prixLogement + travaux + meubles + fraisNotaire + garantieBancaires + fraisDossier + fraisCourtier + fraisAgence
        };
        const montantEmprunte = montantTotal.value - apport;
        inputs.montantEmprunte.value = montantEmprunte.toFixed(2);

        inputs.prixTotalProjet.textContent = `${montantTotal.value} €`;
        inputs.prixTotalProjetHover.textContent = montantTotal.description

        return montantEmprunte
    }

    function calculerMensualite(montant, duree, taux) {
        if (taux === 0) return montant / duree;
        const tauxMensuel = taux / 12;
        return (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -duree));
    }

    function updateTableRecap30(
        annee,
        profitAndLossCumule,
        profitAndLossMensuel,
        coutsAnnuel,
        profitsAnnuel,
        mensualiteCredit,
        capitalRembourseAnnuel,
        interetsPayesAnnuel,
        capitalRembourseCumule,
        interetsCumul,
        impot,
        impotReportable
        ) {

            const dureePret = getFloat(inputs.dureePret);

            const rowAnnee = `
                <tr>
                    <td>${annee}</td>
                </tr>
            `;

            const rowPl = `
                <tr>
                    <td>${profitAndLossCumule.toFixed(2)}</td>
                    <td>${profitAndLossMensuel.toFixed(2)}</td>
                    <td>${coutsAnnuel.toFixed(2)}</td>
                    <td>${profitsAnnuel.toFixed(2)}</td>
                </tr>
            `;

            if (annee > parseInt(dureePret / 12)) {
                rowCredit = `
                    <tr>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>${capitalRembourseCumule.toFixed(2)}</td>
                        <td>${interetsCumul.toFixed(2)}</td>
                    </tr>
                `;
            } else {
                rowCredit = `
                    <tr>
                        <td>${mensualiteCredit.toFixed(2)}</td>
                        <td>${capitalRembourseAnnuel.toFixed(2)}</td>
                        <td>${interetsPayesAnnuel.toFixed(2)}</td>
                        <td>${capitalRembourseCumule.toFixed(2)}</td>
                        <td>${interetsCumul.toFixed(2)}</td>
                    </tr>
                `;
            }

            const rowImpot = `
                <tr>
                    <td>${(impot-impotReportable).toFixed(2)}</td>
                </tr>
            `;
            inputs.recapAnneeBody.insertAdjacentHTML('beforeend', rowAnnee);
            inputs.recapPlBody.insertAdjacentHTML('beforeend', rowPl);
            inputs.recapCreditBody.insertAdjacentHTML('beforeend', rowCredit);
            inputs.recapImpotBody.insertAdjacentHTML('beforeend', rowImpot);
    }

    function getChargesMensuel(chargesCopropriete, assuranceLoyers, loyerHorsCharges, assurancePno, taxeFonciere, coutComptable, mensualite, fraisGestionAgence) {

        const totalChargesMensuel = {
            description:`
                     chargesCopropriete / 12
                                            + (assuranceLoyers * loyerHorsCharges)
                                            + assurancePno / 12
                                            + taxeFonciere / 12
                                            + coutComptable / 12
                                            + mensualite
                                            + fraisGestionAgence
            `,
            value: chargesCopropriete / 12
                            + assuranceLoyers * loyerHorsCharges
                            + assurancePno / 12
                            + taxeFonciere / 12
                            + coutComptable / 12
                            + mensualite
                            + fraisGestionAgence
        };
        inputs.recapTotalChargesHover.textContent = totalChargesMensuel.description;
        return totalChargesMensuel;
    }

    function genererRecapAnnuel() {
        inputs.recapAnneeBody.innerHTML = ''; // Clear existing rows
        inputs.recapPlBody.innerHTML = ''; // Clear existing rows
        inputs.recapCreditBody.innerHTML = ''; // Clear existing rows
        inputs.recapImpotBody.innerHTML = ''; // Clear existing rows
        

        const dureePret = getFloat(inputs.dureePret);
        const tauxInterets = getFloat(inputs.tauxInterets) / 100;
        const tauxAssurance = getFloat(inputs.tauxAssurance) / 100;
        const montantEmprunte = calculerMontantEmprunte();
        const mensualite = calculerMensualite(montantEmprunte, dureePret, tauxInterets) + montantEmprunte * tauxAssurance / 12;
    

        const apport = getFloat(inputs.apport);

        const loyerHorsCharges = getFloat(inputs.loyerHorsCharges);
        const chargesLocatives = getFloat(inputs.chargesLocatives);
        const chargesCopropriete = getFloat(inputs.chargesCopropriete);
        const assuranceLoyers = getFloat(inputs.assuranceLoyers) / 100;
        const assurancePno = getFloat(inputs.assurancePno);
        const coutComptable = getFloat(inputs.coutComptable);
        const taxeFonciere = getFloat(inputs.taxeFonciere);
        const gestionAgence = getFloat(inputs.gestionAgence) / 100;
        const fraisGestionAgence = gestionAgence * (loyerHorsCharges+chargesLocatives);
        const totalChargesMensuel = getChargesMensuel(chargesCopropriete, assuranceLoyers, loyerHorsCharges, assurancePno, taxeFonciere, coutComptable, mensualite, fraisGestionAgence)

        const trancheImpot = getFloat(inputs.trancheImpot) / 100;

        const travaux = getFloat(inputs.travaux);
        const meubles = getFloat(inputs.meubles);
        const fraisNotaire = getFloat(inputs.fraisNotaire);
        const fraisAgence = getFloat(inputs.fraisAgence);
        const garantieBancaires = getFloat(inputs.garantiesBancaires);
        const fraisDossier = getFloat(inputs.fraisDossier);
        const fraisCourtier = getFloat(inputs.fraisCourtier);
        const impotInit = {
            description: `fraisNotaire + fraisAgence + garantieBancaires + fraisDossier + fraisCourtier + travaux + meubles<600e`,
            value: fraisNotaire + fraisAgence + garantieBancaires + fraisDossier + fraisCourtier + travaux + meubles
        };
        inputs.recapImpotHover.textContent = impotInit.description;


        let capitalRestant = montantEmprunte;
        let interetsCumul = 0;
        let capitalRembourseCumule = 0;
        const anneeInit = 0
        const coutsAnnuelInit = apport;
        const profitAndLossCumuleInit = -coutsAnnuelInit;
        const profitAndLossMensuelInit = 0;
        const profitsAnnuelInit = 0;
        const mensualiteInit = 0;
        const capitalRembourseAnnuelInit = 0;
        const interetsPayesAnnuelInit = 0;
        const capitalRembourseCumuleInit = 0;
        const interetsCumulInit = 0;
        let impotReportable = impotInit.value;

        updateTableRecap30(
            anneeInit,
            profitAndLossCumuleInit,
            profitAndLossMensuelInit,
            coutsAnnuelInit,
            profitsAnnuelInit,
            mensualiteInit,
            capitalRembourseAnnuelInit,
            interetsPayesAnnuelInit,
            capitalRembourseCumuleInit,
            interetsCumulInit,
            0,
            impotReportable
            )
        x_axis.push(profitAndLossCumuleInit)

        let profitAndLossCumule = profitAndLossCumuleInit;
        let mensualiteCredit = mensualite
        for (let annee = 1; annee <= annee_max; annee++) {
            y_label.push(`Année ${annee}`);
            let capitalRembourseAnnuel = 0;
            let interetsPayesAnnuel = 0;
            let profitsAnnuel = 0;
            let coutsAnnuel = 0;
            let coutMensuel = totalChargesMensuel.value;

            if (annee > parseInt(dureePret / 12)) {
                mensualiteCredit = 0
                coutMensuel = coutMensuel - mensualite;
            }


            for (let mois = 0; mois < 12; mois++) {
                const interetsMensuels = capitalRestant * tauxInterets / 12;
                const capitalRembourseMensuel = mensualiteCredit - interetsMensuels - (montantEmprunte * tauxAssurance / 12);
                interetsPayesAnnuel += interetsMensuels;
                capitalRembourseAnnuel += capitalRembourseMensuel;
                capitalRestant -= capitalRembourseMensuel;
                if (capitalRestant < 0) capitalRestant = 0;
                profitsAnnuel += (loyerHorsCharges + chargesLocatives);
                coutsAnnuel += coutMensuel;
            }

            capitalRembourseCumule += capitalRembourseAnnuel;
            interetsCumul += interetsPayesAnnuel;

            const coutsDeductibleAnnuel = (chargesCopropriete - chargesLocatives*12) + (loyerHorsCharges * assuranceLoyers * 12) + assurancePno + taxeFonciere + coutComptable + fraisGestionAgence + interetsPayesAnnuel; 
            impotReportable = (loyerHorsCharges*12 - coutsDeductibleAnnuel)*trancheImpot - impotReportable;

            if (impotReportable < 0) {
                impot = 0;
                impotReportable = -impotReportable;
            } else {
                impot = impotReportable;
                impotReportable = 0;
            }

            const profitAndLossMensuel = (profitsAnnuel - coutsAnnuel -impot) / 12;
            profitAndLossCumule += profitsAnnuel - coutsAnnuel -impot;

            x_axis.push(capitalRembourseCumule+profitAndLossCumule)

            updateTableRecap30(
                annee,
                profitAndLossCumule,
                profitAndLossMensuel,
                coutsAnnuel,
                profitsAnnuel,
                mensualiteCredit,
                capitalRembourseAnnuel,
                interetsPayesAnnuel,
                capitalRembourseCumule,
                interetsCumul,
                impot,
                impotReportable
                )

        }
    }

    function updateRecapitulatifGlobal() {

        const dureePret = getFloat(inputs.dureePret);
        const tauxInterets = getFloat(inputs.tauxInterets) / 100;
        const tauxAssurance = getFloat(inputs.tauxAssurance) / 100;
        const montantEmprunte = calculerMontantEmprunte();
        const mensualite = calculerMensualite(montantEmprunte, dureePret, tauxInterets) + montantEmprunte * tauxAssurance / 12;
    

        const loyerHorsCharges = getFloat(inputs.loyerHorsCharges);
        const chargesLocatives = getFloat(inputs.chargesLocatives);
        const chargesCopropriete = getFloat(inputs.chargesCopropriete);
        const assuranceLoyers = getFloat(inputs.assuranceLoyers) / 100;
        const assurancePno = getFloat(inputs.assurancePno);
        const coutComptable = getFloat(inputs.coutComptable);
        const taxeFonciere = getFloat(inputs.taxeFonciere);
        const gestionAgence = getFloat(inputs.gestionAgence) / 100;
        const fraisGestionAgence = gestionAgence * (loyerHorsCharges+chargesLocatives);
        const totalChargesMensuel = getChargesMensuel(chargesCopropriete, assuranceLoyers, loyerHorsCharges, assurancePno, taxeFonciere, coutComptable, mensualite, fraisGestionAgence)
        const prixLogement = getFloat(inputs.prixLogement);
        const travaux = getFloat(inputs.travaux);
        const meubles = getFloat(inputs.meubles);
        const fraisNotaire = getFloat(inputs.fraisNotaire);
        const fraisAgence = getFloat(inputs.fraisAgence);
        const garantieBancaires = getFloat(inputs.garantiesBancaires);
        const fraisDossier = getFloat(inputs.fraisDossier);
        const fraisCourtier = getFloat(inputs.fraisCourtier);

    

        const loyerCC = loyerHorsCharges + + chargesLocatives
                            
        const cashflowMensuel = loyerCC - totalChargesMensuel.value ;

        const rendementBrut = (loyerHorsCharges * 12) / prixLogement * 100;
        const rendementNet = {
            description: `
                [(loyerCC - (totalChargesMensuel - mensualiteCredit)) * 12 * 100] 
                                        / 
                (prixLogement +fraisNotaire + fraisAgence + travaux  + garantieBancaires + fraisDossier + fraisCourtier)
            `,
            value: ((loyerCC - (totalChargesMensuel.value - mensualite)) * 12 * 100) / (prixLogement +fraisNotaire + fraisAgence + travaux + garantieBancaires + fraisDossier + fraisCourtier)
        };
        inputs.recapRendementNetHover.textContent = rendementNet.description;

        inputs.recapLoyer.textContent = `${loyerCC} €`;
        inputs.recapTotalCharges.textContent = `${totalChargesMensuel.value.toFixed(2)} €`;
        inputs.recapCashflow.textContent = `${cashflowMensuel.toFixed(2)} €`;
        inputs.recapRendementBrut.textContent = `${rendementBrut.toFixed(2)} %`;
        inputs.recapRendementNet.textContent = `${rendementNet.value.toFixed(2)} %`;

    }

    function updateAll() {
        calculerTom();
        calculerMontantEmprunte();
        updateRecapitulatifGlobal();
        genererRecapAnnuel();
    }

    // Ajouter des écouteurs d'événements
    for (const key in inputs) {
        if (inputs[key].type === 'number' || inputs[key].type === 'text') {
            inputs[key].addEventListener('input', updateAll);
        }
    }

    // Calcul initial
    updateAll();


    var ctx = document.getElementById('earningsChart').getContext('2d');
    var earningsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: y_label,
            datasets: [{
                label: "Profit si revente au prix d'achat sans frais additionel (capital remboursé - P&L cumulé)(€)",
                data: x_axis, // Example data
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


});

document.querySelectorAll('.tooltip').forEach(function(tooltip) {
  tooltip.addEventListener('mouseenter', function() {
    const tooltipText = tooltip.querySelector('.tooltiptext');
    const rect = tooltipText.getBoundingClientRect();

    if (rect.top < 0) {
      tooltipText.style.top = '125%';
      tooltipText.style.bottom = 'auto';
    }
  });
});
