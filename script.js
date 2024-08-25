document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments du DOM
    const inputs = {
        prixLogement: document.getElementById('prix-logement'),
        travaux: document.getElementById('travaux'),
        meubles: document.getElementById('meubles'),
        apport: document.getElementById('apport'),
        taxeFonciere: document.getElementById('taxe-fonciere'),
        fraisNotaire: document.getElementById('frais-notaire'),
        tauxTom: document.getElementById('taux-tom'),
        tomCalcule: document.getElementById('tom-calcule'),
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
        recapTableBody: document.getElementById('recap-table-body')
    };

    function calculerTom() {
        const taxeFonciere = parseFloat(inputs.taxeFonciere.value) || 0;
        const tauxTom = parseFloat(inputs.tauxTom.value) / 100 || 0;
        const tom = taxeFonciere * tauxTom;
        inputs.tomCalcule.value = tom.toFixed(2);
    }

    function calculerMontantEmprunte() {
        const prixLogement = parseFloat(inputs.prixLogement.value) || 0;
        const travaux = parseFloat(inputs.travaux.value) || 0;
        const meubles = parseFloat(inputs.meubles.value) || 0;
        const fraisNotaire = parseFloat(inputs.fraisNotaire.value) || 0;
        const garantieBancaires = parseFloat(inputs.garantiesBancaires.value) || 0;
        const fraisDossier = parseFloat(inputs.fraisDossier.value) || 0;
        const fraisCourtier = parseFloat(inputs.fraisCourtier.value) || 0;
        const apport = parseFloat(inputs.apport.value) || 0;

        const montantTotal = prixLogement + travaux + meubles + fraisNotaire + garantieBancaires + fraisDossier + fraisCourtier;
        const montantEmprunte = montantTotal - apport;
        inputs.montantEmprunte.value = montantEmprunte.toFixed(2);
        genererRecapAnnuel(); // Ensure recap table updates after amount borrowed is calculated
    }

    function calculerMensualite(montant, duree, taux) {
        if (taux === 0) return montant / duree;
        const tauxMensuel = taux / 12;
        return (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -duree));
    }

    function genererRecapAnnuel() {
        inputs.recapTableBody.innerHTML = ''; // Clear existing rows
        const montantEmprunte = parseFloat(inputs.montantEmprunte.value) || 0;
        const dureePret = parseFloat(inputs.dureePret.value) || 0;
        const tauxInterets = parseFloat(inputs.tauxInterets.value) / 100 || 0;
        const tauxAssurance = parseFloat(inputs.tauxAssurance.value) / 100 || 0;

        const mensualite = calculerMensualite(montantEmprunte, dureePret, tauxInterets) + montantEmprunte * tauxAssurance / 12;
        let capitalRestant = montantEmprunte;
        let interetsCumul = 0;
        let capitalRembourseCumule = 0;

        const loyerHorsCharges = parseFloat(inputs.loyerHorsCharges.value) || 0;
        const chargesLocatives = parseFloat(inputs.chargesLocatives.value) || 0;
        const chargesCopropriete = parseFloat(inputs.chargesCopropriete.value) || 0;
        const assuranceLoyers = parseFloat(inputs.assuranceLoyers.value) / 100 || 0;
        const assurancePno = parseFloat(inputs.assurancePno.value) || 0;
        const taxeFonciere = parseFloat(inputs.taxeFonciere.value) || 0;
        const coutComptable = parseFloat(inputs.coutComptable.value) || 0;

        const anneeInit = 0
        const coutsAnnuelInit = parseFloat(inputs.apport.value) || 0;
        const profitAndLossCumuleInit = -coutsAnnuelInit;
        const profitAndLossMensuelInit = 0;
        const profitsAnnuelInit = 0;
        const mensualiteInit = 0;
        const capitalRembourseAnnuelInit = 0;
        const interetsPayesAnnuelInit = 0;
        const capitalRembourseCumuleInit = 0;
        const interetsCumulInit = 0;
        const rowInit = `
            <tr>
                <td>${anneeInit}</td>
                <td>${profitAndLossCumuleInit.toFixed(2)}</td>
                <td>${profitAndLossMensuelInit.toFixed(2)}</td>
                <td>${coutsAnnuelInit.toFixed(2)}</td>
                <td>${profitsAnnuelInit.toFixed(2)}</td>
                <td>${mensualiteInit.toFixed(2)}</td>
                <td>${capitalRembourseAnnuelInit.toFixed(2)}</td>
                <td>${interetsPayesAnnuelInit.toFixed(2)}</td>
                <td>${capitalRembourseCumuleInit.toFixed(2)}</td>
                <td>${interetsCumulInit.toFixed(2)}</td>
            </tr>
        `;
        inputs.recapTableBody.insertAdjacentHTML('beforeend', rowInit);

        let profitAndLossCumule = profitAndLossCumuleInit;

        for (let annee = 1; annee <= 30; annee++) {
            let capitalRembourseAnnuel = 0;
            let interetsPayesAnnuel = 0;
            let profitsAnnuel = 0;
            let coutsAnnuel = 0;

            for (let mois = 0; mois < 12; mois++) {
                const interetsMensuels = capitalRestant * tauxInterets / 12;
                const capitalRembourseMensuel = mensualite - interetsMensuels;
                interetsPayesAnnuel += interetsMensuels;
                capitalRembourseAnnuel += capitalRembourseMensuel;
                capitalRestant -= capitalRembourseMensuel;
                if (capitalRestant < 0) capitalRestant = 0;

                const coutsMensuel = chargesCopropriete / 12 + loyerHorsCharges * assuranceLoyers + assurancePno / 12 + taxeFonciere / 12 + coutComptable / 12 + mensualite;
                profitsAnnuel += (loyerHorsCharges + chargesLocatives);
                coutsAnnuel += coutsMensuel;
            }

            capitalRembourseCumule += capitalRembourseAnnuel;
            interetsCumul += interetsPayesAnnuel;

            const profitAndLossMensuel = (profitsAnnuel - coutsAnnuel) / 12;
            profitAndLossCumule += profitsAnnuel - coutsAnnuel;

            const row = `
                <tr>
                    <td>${annee}</td>
                    <td>${profitAndLossCumule.toFixed(2)}</td>
                    <td>${profitAndLossMensuel.toFixed(2)}</td>
                    <td>${coutsAnnuel.toFixed(2)}</td>
                    <td>${profitsAnnuel.toFixed(2)}</td>
                    <td>${mensualite.toFixed(2)}</td>
                    <td>${capitalRembourseAnnuel.toFixed(2)}</td>
                    <td>${interetsPayesAnnuel.toFixed(2)}</td>
                    <td>${capitalRembourseCumule.toFixed(2)}</td>
                    <td>${interetsCumul.toFixed(2)}</td>
                </tr>
            `;
            inputs.recapTableBody.insertAdjacentHTML('beforeend', row);
        }
    }

    function updateRecapitulatifGlobal() {
        const loyer = parseFloat(inputs.loyerHorsCharges.value) || 0;
        const totalCharges = parseFloat(inputs.chargesLocatives.value) || 0
                            + parseFloat(inputs.chargesCopropriete.value) || 0
                            + parseFloat(inputs.assuranceLoyers.value) / 100 * loyer
                            + parseFloat(inputs.assurancePno.value) / 12
                            + parseFloat(inputs.taxeFonciere.value) / 12
                            + parseFloat(inputs.coutComptable.value) / 12;
                            
        const mensualite = calculerMensualite(parseFloat(inputs.montantEmprunte.value) || 0, parseFloat(inputs.dureePret.value) || 0, parseFloat(inputs.tauxInterets.value) / 100 || 0) + (parseFloat(inputs.montantEmprunte.value) || 0) * (parseFloat(inputs.tauxAssurance.value) / 100) / 12;

        const cashflowMensuel = loyer - totalCharges - mensualite;

        const rendementBrut = (loyer * 12) / (parseFloat(inputs.prixLogement.value) || 1) * 100;
        const rendementNet = ((loyer * 12) - (totalCharges * 12)) / (parseFloat(inputs.prixLogement.value) || 1) * 100;
        // Hypothèse : impôts sont un pourcentage fixe du loyer brut, vous pouvez ajuster selon vos besoins
        const impots = loyer * 12 * 0.2;
        const rendementNetNet = ((loyer * 12) - (totalCharges * 12) - impots) / (parseFloat(inputs.prixLogement.value) || 1) * 100;

        document.getElementById('recap-loyer').textContent = `${loyer.toFixed(2)} €`;
        document.getElementById('recap-total-charges').textContent = `${totalCharges.toFixed(2)} €`;
        document.getElementById('recap-cashflow').textContent = `${cashflowMensuel.toFixed(2)} €`;
        document.getElementById('recap-rendement-brut').textContent = `${rendementBrut.toFixed(2)} %`;
        document.getElementById('recap-rendement-net').textContent = `${rendementNet.toFixed(2)} %`;
        document.getElementById('recap-rendement-net-net').textContent = `${rendementNetNet.toFixed(2)} %`;
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
