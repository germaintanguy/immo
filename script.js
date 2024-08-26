document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments du DOM
    const inputs = {
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
        recapLoyer: document.getElementById('recap-loyer'),
        recapTotalCharges: document.getElementById('recap-total-charges'),
        recapCashflow: document.getElementById('recap-cashflow'),
        recapRendementBrut: document.getElementById('recap-rendement-brut'),
        recapRendementNet: document.getElementById('recap-rendement-net'),
        recapRendementNetNet:document.getElementById('recap-rendement-net-net'),

    };

    function getFloat(element) {
        return parseFloat(element.value) || 0;
    };

    const prixLogement = getFloat(inputs.prixLogement);
    const travaux = getFloat(inputs.travaux);
    const meubles = getFloat(inputs.meubles);
    const taxeFonciere = getFloat(inputs.taxeFonciere);
    const tauxTom = getFloat(inputs.tauxTom) / 100;
    const fraisNotaire = getFloat(inputs.fraisNotaire);
    const fraisAgence = getFloat(inputs.fraisAgence);
    const garantieBancaires = getFloat(inputs.garantiesBancaires);
    const fraisDossier = getFloat(inputs.fraisDossier);
    const fraisCourtier = getFloat(inputs.fraisCourtier);
    const apport = getFloat(inputs.apport);

    const dureePret = getFloat(inputs.dureePret);
    const tauxInterets = getFloat(inputs.tauxInterets) / 100;
    const tauxAssurance = getFloat(inputs.tauxAssurance) / 100;
    const gestionAgence = getFloat(inputs.gestionAgence) / 100;
    const trancheImpot = getFloat(inputs.trancheImpot) / 100;
    
    const loyerHorsCharges = getFloat(inputs.loyerHorsCharges);
    const chargesLocatives = getFloat(inputs.chargesLocatives);
    const chargesCopropriete = getFloat(inputs.chargesCopropriete);
    const assuranceLoyers = getFloat(inputs.assuranceLoyers) / 100;
    const assurancePno = getFloat(inputs.assurancePno);
    const coutComptable = getFloat(inputs.coutComptable);

    const montantTotal = prixLogement + travaux + meubles + fraisNotaire + garantieBancaires + fraisDossier + fraisCourtier + fraisAgence;
    const montantEmprunte = montantTotal - apport;
    const fraisGestionAgence = gestionAgence * (loyerHorsCharges+chargesLocatives);
    const mensualite = calculerMensualite(montantEmprunte, dureePret, tauxInterets) + montantEmprunte * tauxAssurance / 12;
    const totalChargesMensuel = chargesCopropriete / 12
                        + assuranceLoyers * loyerHorsCharges
                        + assurancePno / 12
                        + taxeFonciere / 12
                        + coutComptable / 12
                        + mensualite
                        + fraisGestionAgence;


    function calculerTom() {
        const tom = taxeFonciere * tauxTom;
        inputs.tomCalcule.value = tom.toFixed(2);
    }


    function calculerMontantEmprunte() {
        inputs.montantEmprunte.value = montantEmprunte.toFixed(2);
        genererRecapAnnuel(); // Ensure recap table updates after amount borrowed is calculated
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

    function genererRecapAnnuel() {
        inputs.recapAnneeBody.innerHTML = ''; // Clear existing rows
        inputs.recapPlBody.innerHTML = ''; // Clear existing rows
        inputs.recapCreditBody.innerHTML = ''; // Clear existing rows
        inputs.recapImpotBody.innerHTML = ''; // Clear existing rows

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
        let impotReportable = fraisNotaire + fraisAgence + garantieBancaires + fraisDossier + fraisCourtier + travaux


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
            -impotReportable
            )


        let profitAndLossCumule = profitAndLossCumuleInit;
        let mensualiteCredit = mensualite
        for (let annee = 1; annee <= 30; annee++) {
            let capitalRembourseAnnuel = 0;
            let interetsPayesAnnuel = 0;
            let profitsAnnuel = 0;
            let coutsAnnuel = 0;
            let coutMensuel = totalChargesMensuel;

            if (annee > parseInt(dureePret / 12)) {
                mensualiteCredit = 0
                coutMensuel = coutMensuel - mensualite;
            }


            for (let mois = 0; mois < 12; mois++) {
                const interetsMensuels = capitalRestant * tauxInterets / 12;
                const capitalRembourseMensuel = mensualiteCredit - interetsMensuels;
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
            profitAndLossCumule += profitsAnnuel - coutsAnnuel;


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

        const loyerCC = loyerHorsCharges + + chargesLocatives
                            
        const cashflowMensuel = loyerCC - totalChargesMensuel ;

        const rendementBrut = (loyerHorsCharges * 12) / prixLogement * 100;
        const rendementNet = ((loyerCC * 12) - ((totalChargesMensuel-mensualite) * 12)) / prixLogement * 100;
        // Hypothèse : impôts sont un pourcentage fixe du loyer brut, vous pouvez ajuster selon vos besoins
        const impots = loyerCC * 12 * 0.2;

        const rendementNetNet = ((loyerCC * 12) - (totalChargesMensuel * 12) - impots) / prixLogement * 100;


        inputs.recapLoyer.textContent = `${loyerCC.toFixed(2)} €`;
        inputs.recapTotalCharges.textContent = `${totalChargesMensuel.toFixed(2)} €`;
        inputs.recapCashflow.textContent = `${cashflowMensuel.toFixed(2)} €`;
        inputs.recapRendementBrut.textContent = `${rendementBrut.toFixed(2)} %`;
        inputs.recapRendementNet.textContent = `${rendementNet.toFixed(2)} %`;
        inputs.recapRendementNetNet.textContent = `${rendementNetNet.toFixed(2)} %`;
    }

    function updateAll() {
        calculerTom();
        calculerMontantEmprunte();
        updateRecapitulatifGlobal();
    }

    // Ajouter des écouteurs d'événements
    for (const key in inputs) {
        if (inputs[key].type === 'number' || inputs[key].type === 'text') {
            inputs[key].addEventListener('input', updateAll);
        }
    }

    // Calcul initial
    updateAll();
});
