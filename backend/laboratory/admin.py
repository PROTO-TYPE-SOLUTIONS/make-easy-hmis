from django.contrib import admin
from .models import *

admin.site.register(LabReagent)

admin.site.register(LabTestProfile)
admin.site.register(LabTestPanel)

admin.site.register(LabTestRequest)
admin.site.register(LabTestRequestPanel)

admin.site.register(LabTestResult)
admin.site.register(LabTestResultPanel)


admin.site.register(LabEquipment)
admin.site.register(EquipmentTestRequest)
