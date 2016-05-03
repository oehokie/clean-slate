angular.module('cleanSlate')
    .controller('questionController', function ($scope, $stateParams, $http, $location, sharedService, Question, currentQuestion) {
        Question.listQuestions($scope).then(function (aQuestions) {
            $scope.questions = aQuestions;
            console.log("number of questions:  " + $scope.questions.length)
        },
            function (aError) {
                // Something went wrong, handle the error
            });

        $scope.showQuestion = function (question) {
            var path = 'admin/question/' + question.questionID;
            $scope.currentQuestion = question;
            sharedService.prepForUpdate("clicked", question);

            //http://stackoverflow.com/questions/14201753/angular-js-how-when-to-use-ng-click-to-call-a-route
            $location.path(path);
        }
        function getQuestion(questionID) {
            for (q in questions) {
                if (questions[q].questionID == questionID) {
                    return questions[q];
                }
            }
        }
    });