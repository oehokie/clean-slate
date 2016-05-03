(function () {
    app.module('app', [])
        .controller("EligibiltyController", eligibilityController);
        
        function eligibilityController(
            $scope,
            $http,
            $window,
            $state,
            $stateParams,
            eligibilityService) {
            "use strict";

            var SUCCESS = "success";
            var WARNING = "warning";
            var DANGER = "danger";

            $scope.eligibilityService = eligibilityService;

            $scope.eligibilityKnown = false;
            $scope.eligibilityFlow = {
                questions: {},
                endStates: {}
            };
            $scope.eligibilityFlowLength = 0;
            $scope.currentState = {};
            $scope.ineligibleMisdemeanors = [];
            $scope.stateName = "";

            $scope.getLevelClass = function getLevelClass() {
                switch ($scope.currentState.level) {
                    case SUCCESS: return "alert-success";
                    case WARNING: return "alert-warning";
                    case DANGER: return "alert-danger";
                    default: return "";
                }
            };
            $scope.previousQuestion = function previousQuestion() {
                if ($scope.stateName === $scope.eligibilityFlow.start) {
                    $window.history.back();

                    return;
                }

                if ($scope.eligibilityKnown) {
                    $scope.eligibilityKnown = false;
                }

                eligibilityService.userInput.pop();

                var previousQuestion = eligibilityService.answeredQuestions.pop();

                $state.go("eligibility", { questionId: previousQuestion });
                $scope.currentState = $scope.eligibilityFlow.questions[previousQuestion];
            };

            $scope.restart = function restart() {
                eligibilityService.userInput = [];
                eligibilityService.answeredQuestions = [];

                $state.go("eligibility", { questionId: $scope.eligibilityFlow.start });
                $scope.currentState = $scope.eligibilityFlow.questions[$scope.eligibilityFlow.start];
            };

            $scope.submitAnswer = function submitAnswer(answerIndex) {
                // if this question was already answered, cleanup userInput before adding this answer to history
                if (eligibilityService.answeredQuestions.indexOf($scope.stateName) > -1) {
                    var startDuplication = eligibilityService.answeredQuestions.indexOf($scope.stateName);
                    eligibilityService.userInput.splice(startDuplication, eligibilityService.userInput.length - startDuplication);
                    eligibilityService.answeredQuestions.splice(startDuplication, eligibilityService.answeredQuestions.length - startDuplication);
                }

                // record this question and answer in record and add to userInput
                var record = {};
                record.question = $scope.currentState.questionText;
                record.answer = $scope.currentState.answers[answerIndex].answerText;
                eligibilityService.userInput.push(record);
                eligibilityService.answeredQuestions.push($scope.stateName);

                var next = $scope.currentState.answers[answerIndex].next;

                // check if this answer leads to an eligibility state
                if (next in $scope.eligibilityFlow.endStates) {
                    $scope.eligibilityKnown = true;
                    $scope.stateName = next;
                    $scope.currentState = $scope.eligibilityFlow.endStates[next];
                    $scope.userInput = eligibilityService.userInput;
                    return;
                }

                // update currentQuestion if eligibility still not known and next question is valid
                if (next in $scope.eligibilityFlow.questions) {
                    $scope.stateName = next;
                    $scope.currentState = $scope.eligibilityFlow.questions[next];
                    return;
                }

                // else if there is no question corresponding to currentQuestion
                throw new Error("There is no question or endState \'" + next + "\' in $scope.eligibilityFlow.");
            };

            $scope.progressBar = function progressBar() {
                var progressPercent = '';
                //If the current question is an EndState, then set the progess bar to 100
                if ($scope.stateName in $scope.eligibilityFlow.endStates) {
                    progressPercent = 100;
                } else {
                    // Otherwise, divide the number of questions answered by the tree height at this state
                    // multiply by 100, and round
                    var answered = eligibilityService.answeredQuestions.length;
                    progressPercent = Math.round((answered / (answered + $scope.currentState.treeHeight - 1)) * 100);
                }
                return progressPercent;
            };
            $scope.readClearly = function readClearly() {
                console.log('readClearly Ran')
                $('#oarc-activate').each(function (i) {
                    $(this).remove();
                });
                OARC.init(true, 'bottom-right', 'neutral');
            };
            $scope.progressBarStyle = function progressBarStyle() {
                return {
                    "min-width": "2em",
                    width: $scope.progressBar() + "%"
                };
            };

            $scope.renderHtml = function (html_code) {
                return $sce.trustAsHtml(html_code);
            };

            $scope.print = function print() {
                ga('send', 'event', 'button', 'click', 'print');
                $window.print();
            };

            // TODO: Implement e-mail functionality...
            $scope.email = function email() { };

            function init() {
                $http.get("data/combined-flow.json", { 'cache': true }).success(function (flow) {
                    $scope.eligibilityFlow = flow;

                    eligibilityService.findTreeHeight($scope.eligibilityFlow, $scope.eligibilityFlow.start);

                    $scope.eligibilityFlowLength = _.size(_.keys($scope.eligibilityFlow.questions));

                    $scope.stateName = $stateParams.questionId;

                    if (_.has($scope.eligibilityFlow.endStates, $scope.stateName)) {
                        $scope.eligibilityKnown = true;
                        $scope.currentState = $scope.eligibilityFlow.endStates[$scope.stateName];
                        $scope.userInput = eligibilityService.userInput;
                    }
                    else if (_.has($scope.eligibilityFlow.questions, $scope.stateName)) {
                        $scope.currentState = $scope.eligibilityFlow.questions[$scope.stateName];
                    }
                    else {
                        $state.go("eligibility", { questionId: $scope.eligibilityFlow.start });
                        $scope.currentState = $scope.eligibilityFlow.questions[$scope.eligibilityFlow.start];
                    }

                    $http.get("data/ineligible-misdemeanors.json", { 'cache': true }).success(function (data) {
                        $scope.ineligibleMisdemeanors = data;
                    });
                });
            }

            init();
        })
});