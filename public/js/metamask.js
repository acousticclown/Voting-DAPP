        var myContract;
        async function CheckMetamaskConnection() {
            // Modern dapp browsers...
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await ethereum.enable();
                    // Acccounts now exposed
                    return true;
                } catch (error) {
                    // User denied account access...
                    return false;
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                window.web3 = new Web3(web3.currentProvider);
                // Acccounts always exposed

                return true;
            }
            // Non-dapp browsers...
            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
                return false;
            }
        }

        $(document).ready(async function () {
            var IsMetamask = await CheckMetamaskConnection();
            if (IsMetamask) {
                myContract =await web3.eth.contract(SmartContractABI).at(SmartContractAddress);
                getCandidate(1);
                getCandidate(2);

                await myContract.eventVote({
                    fromBlock:0
                }, function(err, event){
                    console.log("Event: ", event);
                    getCandidate(event.args._candidateid.toNumber());
                })
                
                console.log("myContract:", myContract);
                console.log("Metamask detected!")
            } else {
                console.log("Metamask not detected");
                Swal.fire({
				  icon: 'error',
				  title: 'Oops...',
				  text: 'Metamask not detected!',
				  onClose() {
				  	location.reload();
				  }
				});
            }
        });

        async function getCandidate(cad){
            await myContract.candidates(cad, function(err, res){
                if(!err){
                    console.log("Result: ", res);
                    document.getElementById("cad" + cad).innerHTML = res[1];
                    document.getElementById("cad" + cad + 'count').innerHTML = res[2].toNumber();
                }
            })
        }

        async function Vote(cad){
            await myContract.vote(cad, function(err, res){
                if(!err){
                    console.log("We are winning!");
                }else{
                    console.log("Can't connect");
                }
            })
        }