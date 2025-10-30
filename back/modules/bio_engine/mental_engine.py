
from modules.core.entities import Subject
import random

class MentalEngine:
    def get_mental_challenge_result(mental_stress_level):
        guaranted_treshold = 12.0
        stress_test_result = random.randint(0, int(mental_stress_level))
        if stress_test_result <= guaranted_treshold:
            return 1.0
        
        #1.0+ чуть больше, 2.0 - в два раза и т.д.
        energy_percentage = stress_test_result/guaranted_treshold
        assimilated_percentage = 1/energy_percentage

        return assimilated_percentage

    def get_assimilation_percentage(subject: Subject, summary_mako_energy:int):
        mental_stability = subject.mental_stability
        #чем выше осознанность, тем больший стресс, тем сложнее проходить испытания
        #чем ниже осознанность, тем больше шанс огрести коррапт от дженовы
        mental_stress_level = summary_mako_energy*mental_stability/100
        result = MentalEngine.get_mental_challenge_result(mental_stress_level)
        return result

